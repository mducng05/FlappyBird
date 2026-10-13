export const GAME_CONSTANTS = {
  // Virtual viewport resolution for consistent physics across devices
  CANVAS_WIDTH: 360,
  CANVAS_HEIGHT: 640,

  // Ground
  GROUND_HEIGHT: 110,

  // Bird dimensions
  BIRD_WIDTH: 36,
  BIRD_HEIGHT: 26,
  BIRD_X: 75,
  BIRD_HITBOX_PADDING: 3, // Forgiving hitbox for better gameplay feel

  // Physics (calculated for ~60fps)
  GRAVITY: 0.38,
  JUMP_VELOCITY: -7.2,
  MAX_FALL_SPEED: 9.5,
  ROTATION_FLAP: -24,
  ROTATION_MAX_FALL: 75,
  ROTATION_FALL_SPEED: 3.5,

  // Pipes
  PIPE_WIDTH: 58,
  PIPE_CAP_HEIGHT: 26,
  PIPE_CAP_EXTRA_WIDTH: 6,
  PIPE_SPEED_EASY: 2.1,
  PIPE_SPEED_NORMAL: 2.5,
  PIPE_SPEED_HARD: 3.0,
  PIPE_GAP_EASY: 145,
  PIPE_GAP_NORMAL: 130,
  PIPE_GAP_HARD: 115,
  PIPE_SPACING: 205,
  MIN_PIPE_HEIGHT: 65,

  // Wing animation
  WING_ANIMATION_INTERVAL_MS: 90,

  // Parallax Background Speeds (relative to pipe speed)
  CLOUD_SPEED: 0.4,
  GROUND_SPEED: 2.5,

  // Medals threshold
  MEDAL_BRONZE: 10,
  MEDAL_SILVER: 20,
  MEDAL_GOLD: 35,
  MEDAL_PLATINUM: 50,

  // Giant Boss Mario Config
  BOSS_SCORE_TRIGGER: 10,
  BOSS_WIDTH: 88,
  BOSS_HEIGHT: 105,
  BOSS_HP: 100,
  BOSS_X: 252,
  BOSS_FLOAT_SPEED: 1.2,
  BOSS_ATTACK_INTERVAL_FRAMES: 130,
  BOSS_LASER_WARNING_FRAMES: 60,
  BOSS_LASER_ACTIVE_FRAMES: 45,
  BOSS_LASER_HEIGHT: 36,
  BOSS_PROJECTILE_SIZE: 24,
  BOSS_EGG_SPEED: 7.0,
  BOSS_EGG_SIZE: 14,
  BOSS_EGG_DAMAGE: 10,
} as const;

export const DIFFICULTY_CONFIG = {
  easy: {
    gap: GAME_CONSTANTS.PIPE_GAP_EASY,
    speed: GAME_CONSTANTS.PIPE_SPEED_EASY,
    label: 'Dễ',
  },
  normal: {
    gap: GAME_CONSTANTS.PIPE_GAP_NORMAL,
    speed: GAME_CONSTANTS.PIPE_SPEED_NORMAL,
    label: 'Vừa',
  },
  hard: {
    gap: GAME_CONSTANTS.PIPE_GAP_HARD,
    speed: GAME_CONSTANTS.PIPE_SPEED_HARD,
    label: 'Khó',
  },
} as const;
