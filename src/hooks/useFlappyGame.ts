import { useState, useEffect, useRef, useCallback } from 'react';
import { Platform } from 'react-native';
import {
  BirdSkin,
  BirdState,
  BossProjectile,
  BossState,
  GameSettings,
  GameStats,
  GameStatus,
  PipePair,
  PlayerEgg,
} from '@/types/game';
import {
  GAME_CONSTANTS,
  DIFFICULTY_CONFIG,
} from '@/constants/gameConfig';
import { BIRD_SKINS } from '@/constants/skins';
import {
  PLAYABLE_HEIGHT,
  checkBossCollisions,
  checkCollisions,
  createPipePair,
  flapBirdPhysics,
  updateBirdPhysics,
} from '@/utils/physics';
import { SoundEffects } from '@/utils/sound';
import { StorageService, DEFAULT_SETTINGS, DEFAULT_STATS } from '@/utils/storage';

const INITIAL_BIRD_Y = (PLAYABLE_HEIGHT - GAME_CONSTANTS.BIRD_HEIGHT) / 2;

const INITIAL_BOSS_STATE: BossState = {
  phase: 'none',
  hp: GAME_CONSTANTS.BOSS_HP,
  maxHp: GAME_CONSTANTS.BOSS_HP,
  x: GAME_CONSTANTS.BOSS_X,
  y: 120,
  direction: 1,
  attackCooldown: 15, // First attack fires in 15 frames (~0.25s)!
  currentAttack: null,
  laserWarningTimer: 0,
  laserActiveTimer: 0,
  laserY: 150,
  laserHeight: 44,
  projectiles: [],
  playerEggs: [],
  warningTimer: 0,
};

export function useFlappyGame() {
  const [status, setStatus] = useState<GameStatus>('idle');
  const [bird, setBird] = useState<BirdState>({
    y: INITIAL_BIRD_Y,
    velocity: 0,
    rotation: 0,
    wingFrame: 1,
  });
  const [pipes, setPipes] = useState<PipePair[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [groundOffset, setGroundOffset] = useState(0);
  const [cloudOffset, setCloudOffset] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [screenFlash, setScreenFlash] = useState(false);
  const [boss, setBoss] = useState<BossState>(INITIAL_BOSS_STATE);

  const [settings, setSettings] = useState<GameSettings>(DEFAULT_SETTINGS);
  const [stats, setStats] = useState<GameStats>(DEFAULT_STATS);
  const [selectedSkin, setSelectedSkin] = useState<BirdSkin>(BIRD_SKINS[0]);

  // Modals visibility
  const [showSkinModal, setShowSkinModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Refs for loop state
  const statusRef = useRef<GameStatus>('idle');
  const birdRef = useRef<BirdState>({
    y: INITIAL_BIRD_Y,
    velocity: 0,
    rotation: 0,
    wingFrame: 1,
  });
  const pipesRef = useRef<PipePair[]>([]);
  const scoreRef = useRef(0);
  const highScoreRef = useRef(0);
  const groundOffsetRef = useRef(0);
  const cloudOffsetRef = useRef(0);
  const flapsRef = useRef(0);
  const pipeIdRef = useRef(0);
  const idleTickRef = useRef(0);
  const lastWingUpdateRef = useRef(0);
  const bossRef = useRef<BossState>(INITIAL_BOSS_STATE);
  const bossAttackIndexRef = useRef(0);
  const projectileIdRef = useRef(100);
  const requestAnimationRef = useRef<number | null>(null);

  // Sync refs with state in useEffect to respect React purity
  useEffect(() => {
    statusRef.current = status;
    birdRef.current = bird;
    pipesRef.current = pipes;
    scoreRef.current = score;
    highScoreRef.current = highScore;
    bossRef.current = boss;
  }, [status, bird, pipes, score, highScore, boss]);

  // Load saved high score, stats, skins, settings on mount
  useEffect(() => {
    async function initStorage() {
      const [savedHighScore, savedSettings, savedStats, savedSkinId] =
        await Promise.all([
          StorageService.getHighScore(),
          StorageService.getSettings(),
          StorageService.getStats(),
          StorageService.getSelectedSkinId(),
        ]);

      setHighScore(savedHighScore);
      highScoreRef.current = savedHighScore;
      setSettings(savedSettings);
      setStats(savedStats);

      const foundSkin =
        BIRD_SKINS.find((s) => s.id === savedSkinId) || BIRD_SKINS[0];
      setSelectedSkin(foundSkin);
    }
    initStorage();
  }, []);

  // Update skin
  const changeSkin = useCallback(async (skin: BirdSkin) => {
    setSelectedSkin(skin);
    await StorageService.saveSelectedSkinId(skin.id);
  }, []);

  // Update settings
  const updateSettings = useCallback(async (newSettings: GameSettings) => {
    setSettings(newSettings);
    await StorageService.saveSettings(newSettings);
  }, []);

  // Trigger game over
  const triggerGameOver = useCallback(async () => {
    setStatus('gameover');
    statusRef.current = 'gameover';
    setScreenFlash(true);
    setTimeout(() => setScreenFlash(false), 140);

    SoundEffects.hit(settings.soundEnabled, settings.hapticsEnabled);
    setTimeout(() => {
      SoundEffects.die(settings.soundEnabled, settings.hapticsEnabled);
    }, 120);

    const { newHigh, stats: updatedStats } =
      await StorageService.recordGameFinished(
        scoreRef.current,
        flapsRef.current
      );

    if (newHigh) {
      setIsNewHighScore(true);
      setHighScore(scoreRef.current);
      highScoreRef.current = scoreRef.current;
    }
    setStats(updatedStats);
  }, [settings.soundEnabled, settings.hapticsEnabled]);

  // Shoot egg at Mario Boss
  const shootEgg = useCallback(() => {
    if (statusRef.current !== 'playing' || bossRef.current.phase !== 'active') return;
    const currentBoss = bossRef.current;
    const newEggId = Date.now() + Math.random();
    const newEgg: PlayerEgg = {
      id: newEggId,
      x: GAME_CONSTANTS.BIRD_X + GAME_CONSTANTS.BIRD_WIDTH,
      y: birdRef.current.y + GAME_CONSTANTS.BIRD_HEIGHT / 2 - 7,
      vx: GAME_CONSTANTS.BOSS_EGG_SPEED,
    };
    const updatedBoss: BossState = {
      ...currentBoss,
      playerEggs: [...currentBoss.playerEggs, newEgg],
    };
    bossRef.current = updatedBoss;
    setBoss(updatedBoss);
    SoundEffects.shootEgg(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Flap action
  const flap = useCallback(() => {
    if (statusRef.current === 'idle') {
      setStatus('playing');
      statusRef.current = 'playing';
      flapsRef.current = 1;
      setIsNewHighScore(false);

      const diff = DIFFICULTY_CONFIG[settings.difficulty];
      pipeIdRef.current = 1;
      const initialPipes = [
        createPipePair(1, GAME_CONSTANTS.CANVAS_WIDTH + 80, diff.gap),
      ];
      setPipes(initialPipes);
      pipesRef.current = initialPipes;

      const newBird = flapBirdPhysics(birdRef.current);
      setBird(newBird);
      birdRef.current = newBird;

      SoundEffects.flap(settings.soundEnabled, settings.hapticsEnabled);
      return;
    }

    if (statusRef.current === 'playing') {
      flapsRef.current += 1;
      const newBird = flapBirdPhysics(birdRef.current);
      setBird(newBird);
      birdRef.current = newBird;

      SoundEffects.flap(settings.soundEnabled, settings.hapticsEnabled);

      // Auto shoot an egg when flapping during Boss fight
      if (bossRef.current.phase === 'active') {
        shootEgg();
      }
      return;
    }
  }, [settings.difficulty, settings.soundEnabled, settings.hapticsEnabled, shootEgg]);

  // Restart to idle
  const restartGame = useCallback(() => {
    SoundEffects.swoosh(settings.soundEnabled);
    setStatus('idle');
    statusRef.current = 'idle';
    setScore(0);
    scoreRef.current = 0;
    flapsRef.current = 0;
    setIsNewHighScore(false);
    setPipes([]);
    pipesRef.current = [];
    setBoss(INITIAL_BOSS_STATE);
    bossRef.current = INITIAL_BOSS_STATE;

    const resetBird: BirdState = {
      y: INITIAL_BIRD_Y,
      velocity: 0,
      rotation: 0,
      wingFrame: 1,
    };
    setBird(resetBird);
    birdRef.current = resetBird;
  }, [settings.soundEnabled]);

  // Start instant Boss Battle directly
  const startBossBattle = useCallback(() => {
    SoundEffects.bossWarning(settings.soundEnabled, settings.hapticsEnabled);
    bossAttackIndexRef.current = 0;
    const triggeredBoss: BossState = {
      ...INITIAL_BOSS_STATE,
      phase: 'active',
      x: GAME_CONSTANTS.BOSS_X,
      warningTimer: 0,
      attackCooldown: 12,
    };
    bossRef.current = triggeredBoss;
    setBoss({ ...triggeredBoss });

    if (statusRef.current === 'idle') {
      setStatus('playing');
      statusRef.current = 'playing';
      flapsRef.current = 1;
      setPipes([]);
      pipesRef.current = [];
      const newBird = flapBirdPhysics(birdRef.current);
      setBird(newBird);
      birdRef.current = newBird;
      SoundEffects.flap(settings.soundEnabled, settings.hapticsEnabled);
    }
  }, [settings.soundEnabled, settings.hapticsEnabled]);

  // Pause / Resume
  const togglePause = useCallback(() => {
    if (statusRef.current === 'playing') {
      setStatus('paused');
      statusRef.current = 'paused';
      SoundEffects.click(settings.soundEnabled, settings.hapticsEnabled);
    } else if (statusRef.current === 'paused') {
      setStatus('playing');
      statusRef.current = 'playing';
      SoundEffects.click(settings.soundEnabled, settings.hapticsEnabled);
    }
  }, [settings.soundEnabled, settings.hapticsEnabled]);

  // Main 60fps game loop
  useEffect(() => {
    let animationFrameId: number;

    const gameLoop = () => {
      const currentStatus = statusRef.current;
      const diff = DIFFICULTY_CONFIG[settings.difficulty];

      // Wing frame flapping animation tick
      const now = Date.now();
      let nextWingFrame = birdRef.current.wingFrame;
      if (now - lastWingUpdateRef.current > GAME_CONSTANTS.WING_ANIMATION_INTERVAL_MS) {
        lastWingUpdateRef.current = now;
        nextWingFrame = ((nextWingFrame + 1) % 3) as 0 | 1 | 2;
      }

      if (currentStatus === 'idle') {
        // Idle gentle hover animation
        idleTickRef.current += 0.07;
        const hoverY = INITIAL_BIRD_Y + Math.sin(idleTickRef.current) * 6;

        // Scrolling ground & clouds during idle
        groundOffsetRef.current =
          (groundOffsetRef.current + GAME_CONSTANTS.GROUND_SPEED) % 24;
        cloudOffsetRef.current =
          (cloudOffsetRef.current + GAME_CONSTANTS.CLOUD_SPEED) % 360;

        setGroundOffset(groundOffsetRef.current);
        setCloudOffset(cloudOffsetRef.current);

        setBird((prev) => ({
          ...prev,
          y: hoverY,
          velocity: 0,
          rotation: 0,
          wingFrame: nextWingFrame,
        }));
      } else if (currentStatus === 'playing') {
        // Scrolling ground & clouds
        groundOffsetRef.current =
          (groundOffsetRef.current + diff.speed) % 24;
        cloudOffsetRef.current =
          (cloudOffsetRef.current + GAME_CONSTANTS.CLOUD_SPEED) % 360;
        setGroundOffset(groundOffsetRef.current);
        setCloudOffset(cloudOffsetRef.current);

        // Update Bird
        const updatedBird = updateBirdPhysics(birdRef.current);
        updatedBird.wingFrame = nextWingFrame;

        // Trigger Boss Mario if threshold reached
        const currentBoss = bossRef.current;
        if (
          settings.bossModeEnabled &&
          currentBoss.phase === 'none' &&
          scoreRef.current >= GAME_CONSTANTS.BOSS_SCORE_TRIGGER
        ) {
          currentBoss.phase = 'warning';
          currentBoss.warningTimer = 50;
          currentBoss.attackCooldown = 15;
          currentBoss.x = GAME_CONSTANTS.BOSS_X;
          SoundEffects.bossWarning(settings.soundEnabled, settings.hapticsEnabled);
        }

        // Update Boss Mario State
        if (currentBoss.phase !== 'none') {
          if (currentBoss.phase === 'warning') {
            currentBoss.warningTimer -= 1;
            if (currentBoss.warningTimer <= 0) {
              currentBoss.phase = 'active';
              currentBoss.x = GAME_CONSTANTS.BOSS_X;
              currentBoss.attackCooldown = 15;
            }
          } else if (currentBoss.phase === 'active') {
            // Keep Mario on screen
            currentBoss.x = GAME_CONSTANTS.BOSS_X;

            // Floating up and down
            currentBoss.y += currentBoss.direction * GAME_CONSTANTS.BOSS_FLOAT_SPEED;
            if (currentBoss.y <= 55) {
              currentBoss.direction = 1;
            } else if (
              currentBoss.y >=
              PLAYABLE_HEIGHT - GAME_CONSTANTS.BOSS_HEIGHT - 20
            ) {
              currentBoss.direction = -1;
            }

            // Attack cycle
            currentBoss.attackCooldown -= 1;
            if (currentBoss.attackCooldown <= 0) {
              const attackType = bossAttackIndexRef.current % 4;
              bossAttackIndexRef.current += 1;

              if (attackType === 0) {
                // 1. Mushroom Toss (Ném Nấm)
                currentBoss.currentAttack = 'mushroom';
                const proj1: BossProjectile = {
                  id: ++projectileIdRef.current,
                  type: 'mushroom',
                  x: currentBoss.x - 20,
                  y: Math.max(40, currentBoss.y + 10),
                  vx: -3.2,
                  vy: -1.3,
                  size: 34,
                  angle: 0,
                };
                const proj2: BossProjectile = {
                  id: ++projectileIdRef.current,
                  type: 'mushroom',
                  x: currentBoss.x - 20,
                  y: Math.min(PLAYABLE_HEIGHT - 60, currentBoss.y + 45),
                  vx: -3.4,
                  vy: 1.3,
                  size: 34,
                  angle: 0,
                };
                currentBoss.projectiles = [...currentBoss.projectiles, proj1, proj2];
                SoundEffects.bossFire(settings.soundEnabled);
                currentBoss.attackCooldown = 65; // ~1.1s to next attack
              } else if (attackType === 1) {
                // 2. Mega Laser (Tia Laze)
                currentBoss.currentAttack = 'laser';
                currentBoss.laserY = Math.max(40, Math.min(PLAYABLE_HEIGHT - 80, currentBoss.y + 24));
                currentBoss.laserWarningTimer = 45; // ~0.75s clear warning
                SoundEffects.bossWarning(settings.soundEnabled, settings.hapticsEnabled);
                currentBoss.attackCooldown = 95; // wait for laser duration + delay
              } else if (attackType === 2) {
                // 3. Fireball Burst (Cầu Lửa)
                currentBoss.currentAttack = 'fireball';
                const f1: BossProjectile = {
                  id: ++projectileIdRef.current,
                  type: 'fireball',
                  x: currentBoss.x - 20,
                  y: currentBoss.y + 10,
                  vx: -3.8,
                  vy: -1.5,
                  size: 30,
                  angle: 0,
                };
                const f2: BossProjectile = {
                  id: ++projectileIdRef.current,
                  type: 'fireball',
                  x: currentBoss.x - 20,
                  y: currentBoss.y + 35,
                  vx: -4.2,
                  vy: 0,
                  size: 30,
                  angle: 0,
                };
                const f3: BossProjectile = {
                  id: ++projectileIdRef.current,
                  type: 'fireball',
                  x: currentBoss.x - 20,
                  y: currentBoss.y + 55,
                  vx: -3.8,
                  vy: 1.5,
                  size: 30,
                  angle: 0,
                };
                currentBoss.projectiles = [...currentBoss.projectiles, f1, f2, f3];
                SoundEffects.bossFire(settings.soundEnabled);
                currentBoss.attackCooldown = 65;
              } else {
                // 4. Koopa Shell (Mai Rùa)
                currentBoss.currentAttack = 'mushroom';
                const shell: BossProjectile = {
                  id: ++projectileIdRef.current,
                  type: 'shell',
                  x: currentBoss.x - 20,
                  y: currentBoss.y + 30,
                  vx: -4.8,
                  vy: 0.4,
                  size: 32,
                  angle: 0,
                };
                currentBoss.projectiles = [...currentBoss.projectiles, shell];
                SoundEffects.bossFire(settings.soundEnabled);
                currentBoss.attackCooldown = 60;
              }
            }

            // Laser Timers
            if (currentBoss.laserWarningTimer > 0) {
              currentBoss.laserWarningTimer -= 1;
              if (currentBoss.laserWarningTimer === 0) {
                currentBoss.laserActiveTimer = GAME_CONSTANTS.BOSS_LASER_ACTIVE_FRAMES;
                SoundEffects.bossLaser(settings.soundEnabled, settings.hapticsEnabled);
              }
            } else if (currentBoss.laserActiveTimer > 0) {
              currentBoss.laserActiveTimer -= 1;
              if (currentBoss.laserActiveTimer === 0) {
                currentBoss.currentAttack = null;
              }
            }

            // Update Projectiles
            const updatedProjectiles: BossProjectile[] = [];
            for (const proj of currentBoss.projectiles) {
              const newX = proj.x + proj.vx;
              let newY = proj.y + proj.vy;
              let newVy = proj.vy;

              // Bounce off ceiling or ground
              if (newY <= 15 || newY >= PLAYABLE_HEIGHT - proj.size - 5) {
                newVy = -newVy;
                newY = proj.y + newVy;
              }

              if (newX + proj.size > -30) {
                updatedProjectiles.push({
                  ...proj,
                  x: newX,
                  y: newY,
                  vy: newVy,
                  angle: (proj.angle + 8) % 360,
                });
              }
            }
            currentBoss.projectiles = updatedProjectiles;

            // Update Player Eggs
            const updatedEggs: PlayerEgg[] = [];
            for (const egg of currentBoss.playerEggs) {
              const newX = egg.x + egg.vx;
              // Check collision with Boss Mario
              if (
                newX >= currentBoss.x &&
                egg.y >= currentBoss.y &&
                egg.y <= currentBoss.y + GAME_CONSTANTS.BOSS_HEIGHT
              ) {
                // Hit Boss!
                currentBoss.hp = Math.max(0, currentBoss.hp - GAME_CONSTANTS.BOSS_EGG_DAMAGE);
                SoundEffects.bossHit(settings.soundEnabled, settings.hapticsEnabled);

                if (currentBoss.hp <= 0) {
                  currentBoss.phase = 'defeated';
                  scoreRef.current += 20;
                  setScore(scoreRef.current);
                  SoundEffects.bossDefeated(settings.soundEnabled, settings.hapticsEnabled);
                  StorageService.recordBossDefeated();
                }
              } else if (newX < GAME_CONSTANTS.CANVAS_WIDTH + 20) {
                updatedEggs.push({ ...egg, x: newX });
              }
            }
            currentBoss.playerEggs = updatedEggs;
          }

          setBoss({
            ...currentBoss,
            projectiles: [...currentBoss.projectiles],
            playerEggs: [...currentBoss.playerEggs],
          });
        }

        // Update Pipes (pause pipe spawning when Boss is active/warning)
        const currentPipes = pipesRef.current;
        const newPipes: PipePair[] = [];
        let earnedScore = false;

        for (let i = 0; i < currentPipes.length; i++) {
          const pipe = currentPipes[i];
          const newX = pipe.x - diff.speed;

          let isPassed = pipe.passed;
          if (!isPassed && newX + GAME_CONSTANTS.PIPE_WIDTH < GAME_CONSTANTS.BIRD_X) {
            isPassed = true;
            earnedScore = true;
          }

          if (newX + GAME_CONSTANTS.PIPE_WIDTH > -20) {
            newPipes.push({
              ...pipe,
              x: newX,
              passed: isPassed,
            });
          }
        }

        // Spawn next pipe only if Boss is NOT active
        if (currentBoss.phase === 'none' || currentBoss.phase === 'defeated') {
          const lastPipe = newPipes[newPipes.length - 1];
          if (
            !lastPipe ||
            lastPipe.x <= GAME_CONSTANTS.CANVAS_WIDTH - GAME_CONSTANTS.PIPE_SPACING
          ) {
            pipeIdRef.current += 1;
            const nextPipe = createPipePair(
              pipeIdRef.current,
              GAME_CONSTANTS.CANVAS_WIDTH + 20,
              diff.gap
            );
            newPipes.push(nextPipe);
          }
        }

        pipesRef.current = newPipes;
        setPipes(newPipes);

        // Score update
        if (earnedScore) {
          scoreRef.current += 1;
          setScore(scoreRef.current);
          SoundEffects.score(settings.soundEnabled, settings.hapticsEnabled);
        }

        // Check Pipe / Ground Collision
        const { collided } = checkCollisions(updatedBird, newPipes, diff.gap);

        // Check Boss Attacks Collision
        const bossCollision = checkBossCollisions(updatedBird, currentBoss);

        if ((collided || bossCollision.collided) && statusRef.current === 'playing') {
          setBird(updatedBird);
          birdRef.current = updatedBird;
          triggerGameOver();
        } else {
          setBird(updatedBird);
          birdRef.current = updatedBird;
        }
      } else if (currentStatus === 'gameover') {
        if (birdRef.current.y + GAME_CONSTANTS.BIRD_HEIGHT < PLAYABLE_HEIGHT) {
          const fallingBird = updateBirdPhysics(birdRef.current);
          fallingBird.wingFrame = 1;
          setBird(fallingBird);
          birdRef.current = fallingBird;
        }
      }

      animationFrameId = requestAnimationFrame(gameLoop);
    };

    animationFrameId = requestAnimationFrame(gameLoop);
    requestAnimationRef.current = animationFrameId;

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [
    settings.difficulty,
    settings.soundEnabled,
    settings.hapticsEnabled,
    settings.bossModeEnabled,
    triggerGameOver,
  ]);

  // Keyboard controls for Web
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        if (statusRef.current === 'gameover') {
          restartGame();
        } else {
          flap();
        }
      } else if (e.code === 'KeyF' || e.code === 'Enter') {
        e.preventDefault();
        shootEgg();
      } else if (e.code === 'KeyP' || e.code === 'Escape') {
        e.preventDefault();
        togglePause();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [flap, restartGame, shootEgg, togglePause]);

  return {
    status,
    bird,
    pipes,
    score,
    highScore,
    groundOffset,
    cloudOffset,
    isNewHighScore,
    screenFlash,
    selectedSkin,
    settings,
    stats,
    boss,
    showSkinModal,
    showStatsModal,
    showSettingsModal,
    flap,
    shootEgg,
    startBossBattle,
    restartGame,
    togglePause,
    changeSkin,
    updateSettings,
    setShowSkinModal,
    setShowStatsModal,
    setShowSettingsModal,
  };
}
