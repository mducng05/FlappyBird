export type GameStatus = 'idle' | 'playing' | 'gameover' | 'paused';

export interface BirdState {
  y: number;
  velocity: number;
  rotation: number; // degrees
  wingFrame: 0 | 1 | 2; // 0: down, 1: mid, 2: up
}

export interface PipePair {
  id: number;
  x: number;
  topHeight: number;
  bottomHeight: number;
  passed: boolean;
}

export interface GameSettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  theme: 'day' | 'night' | 'auto';
  difficulty: 'easy' | 'normal' | 'hard';
  bossModeEnabled: boolean;
}

export interface BirdSkin {
  id: string;
  name: string;
  bodyColor: string;
  bellyColor: string;
  wingColor: string;
  beakColor: string;
  eyeColor: string;
  outlineColor: string;
  requiredScore: number;
  description: string;
}

export type MedalType = 'none' | 'bronze' | 'silver' | 'gold' | 'platinum';

export interface GameStats {
  highScore: number;
  totalGames: number;
  totalScore: number;
  totalFlaps: number;
  bestMedal: MedalType;
  bossesDefeated: number;
}

// Boss Mario Types
export type BossPhase = 'none' | 'warning' | 'active' | 'defeated';
export type BossAttackType = 'laser' | 'mushroom' | 'fireball' | 'slam';

export interface BossProjectile {
  id: number;
  type: 'mushroom' | 'fireball' | 'shell';
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  angle: number;
}

export interface PlayerEgg {
  id: number;
  x: number;
  y: number;
  vx: number;
}

export interface BossState {
  phase: BossPhase;
  hp: number;
  maxHp: number;
  x: number;
  y: number;
  direction: 1 | -1;
  attackCooldown: number;
  currentAttack: BossAttackType | null;
  laserWarningTimer: number; // frames countdown
  laserActiveTimer: number; // frames firing
  laserY: number;
  laserHeight: number;
  projectiles: BossProjectile[];
  playerEggs: PlayerEgg[];
  warningTimer: number;
}
