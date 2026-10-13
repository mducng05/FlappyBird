import { GAME_CONSTANTS } from '@/constants/gameConfig';
import { BirdState, BossState, PipePair } from '@/types/game';

export const PLAYABLE_HEIGHT = GAME_CONSTANTS.CANVAS_HEIGHT - GAME_CONSTANTS.GROUND_HEIGHT;

export function updateBirdPhysics(
  bird: BirdState,
  gravity: number = GAME_CONSTANTS.GRAVITY,
  maxFallSpeed: number = GAME_CONSTANTS.MAX_FALL_SPEED,
  fallRotationSpeed: number = GAME_CONSTANTS.ROTATION_FALL_SPEED
): BirdState {
  const newVelocity = Math.min(bird.velocity + gravity, maxFallSpeed);
  const newY = bird.y + newVelocity;

  let newRotation = bird.rotation;
  if (newVelocity > 1) {
    newRotation = Math.min(
      bird.rotation + fallRotationSpeed,
      GAME_CONSTANTS.ROTATION_MAX_FALL
    );
  }

  return {
    ...bird,
    y: newY,
    velocity: newVelocity,
    rotation: newRotation,
  };
}

export function flapBirdPhysics(
  bird: BirdState,
  jumpVelocity: number = GAME_CONSTANTS.JUMP_VELOCITY,
  flapRotation: number = GAME_CONSTANTS.ROTATION_FLAP
): BirdState {
  return {
    ...bird,
    velocity: jumpVelocity,
    rotation: flapRotation,
  };
}

export function createPipePair(
  id: number,
  startX: number,
  gap: number = GAME_CONSTANTS.PIPE_GAP_NORMAL
): PipePair {
  const minHeight = GAME_CONSTANTS.MIN_PIPE_HEIGHT;
  const maxTopHeight = PLAYABLE_HEIGHT - gap - minHeight;
  const topHeight = Math.floor(Math.random() * (maxTopHeight - minHeight + 1)) + minHeight;
  const bottomHeight = PLAYABLE_HEIGHT - (topHeight + gap);

  return {
    id,
    x: startX,
    topHeight,
    bottomHeight,
    passed: false,
  };
}

export function checkCollisions(
  bird: BirdState,
  pipes: PipePair[],
  gap: number = GAME_CONSTANTS.PIPE_GAP_NORMAL
): { collided: boolean; reason?: 'ground' | 'ceiling' | 'pipe' } {
  const { BIRD_WIDTH, BIRD_HEIGHT, BIRD_X, BIRD_HITBOX_PADDING, PIPE_WIDTH } =
    GAME_CONSTANTS;

  // Ground collision
  if (bird.y + BIRD_HEIGHT >= PLAYABLE_HEIGHT) {
    return { collided: true, reason: 'ground' };
  }

  // Ceiling collision
  if (bird.y <= 0) {
    return { collided: true, reason: 'ceiling' };
  }

  const birdLeft = BIRD_X + BIRD_HITBOX_PADDING;
  const birdRight = BIRD_X + BIRD_WIDTH - BIRD_HITBOX_PADDING;
  const birdTop = bird.y + BIRD_HITBOX_PADDING;
  const birdBottom = bird.y + BIRD_HEIGHT - BIRD_HITBOX_PADDING;

  for (const pipe of pipes) {
    const pipeLeft = pipe.x;
    const pipeRight = pipe.x + PIPE_WIDTH;

    // Check if bird is within pipe's horizontal bounds
    if (birdRight > pipeLeft && birdLeft < pipeRight) {
      // Top pipe collision
      if (birdTop < pipe.topHeight) {
        return { collided: true, reason: 'pipe' };
      }

      // Bottom pipe collision
      const bottomPipeTop = pipe.topHeight + gap;
      if (birdBottom > bottomPipeTop) {
        return { collided: true, reason: 'pipe' };
      }
    }
  }

  return { collided: false };
}

export function checkBossCollisions(
  bird: BirdState,
  boss: BossState
): { collided: boolean; reason?: 'laser' | 'projectile' | 'boss' } {
  if (boss.phase !== 'active') return { collided: false };

  const { BIRD_WIDTH, BIRD_HEIGHT, BIRD_X, BIRD_HITBOX_PADDING, BOSS_WIDTH, BOSS_HEIGHT } =
    GAME_CONSTANTS;

  const birdLeft = BIRD_X + BIRD_HITBOX_PADDING;
  const birdRight = BIRD_X + BIRD_WIDTH - BIRD_HITBOX_PADDING;
  const birdTop = bird.y + BIRD_HITBOX_PADDING;
  const birdBottom = bird.y + BIRD_HEIGHT - BIRD_HITBOX_PADDING;

  // 1. Laser collision
  if (boss.laserActiveTimer > 0) {
    const laserTop = boss.laserY;
    const laserBottom = boss.laserY + boss.laserHeight;
    if (birdRight > 0 && birdLeft < boss.x + 30) {
      if (birdBottom > laserTop && birdTop < laserBottom) {
        return { collided: true, reason: 'laser' };
      }
    }
  }

  // 2. Projectiles collision
  const birdCenterX = BIRD_X + BIRD_WIDTH / 2;
  const birdCenterY = bird.y + BIRD_HEIGHT / 2;

  for (const proj of boss.projectiles) {
    const projCenterX = proj.x + proj.size / 2;
    const projCenterY = proj.y + proj.size / 2;
    const distance = Math.hypot(birdCenterX - projCenterX, birdCenterY - projCenterY);
    if (distance < BIRD_WIDTH / 2.3 + proj.size / 2.3) {
      return { collided: true, reason: 'projectile' };
    }
  }

  // 3. Boss body collision
  if (
    birdRight > boss.x &&
    birdLeft < boss.x + BOSS_WIDTH &&
    birdBottom > boss.y &&
    birdTop < boss.y + BOSS_HEIGHT
  ) {
    return { collided: true, reason: 'boss' };
  }

  return { collided: false };
}
