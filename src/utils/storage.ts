import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '@/constants/storageKeys';
import { GameSettings, GameStats, MedalType } from '@/types/game';
import { GAME_CONSTANTS } from '@/constants/gameConfig';

export const DEFAULT_SETTINGS: GameSettings = {
  soundEnabled: true,
  hapticsEnabled: true,
  theme: 'auto',
  difficulty: 'normal',
  bossModeEnabled: true,
};

export const DEFAULT_STATS: GameStats = {
  highScore: 0,
  totalGames: 0,
  totalScore: 0,
  totalFlaps: 0,
  bestMedal: 'none',
  bossesDefeated: 0,
};

function calculateMedal(score: number): MedalType {
  if (score >= GAME_CONSTANTS.MEDAL_PLATINUM) return 'platinum';
  if (score >= GAME_CONSTANTS.MEDAL_GOLD) return 'gold';
  if (score >= GAME_CONSTANTS.MEDAL_SILVER) return 'silver';
  if (score >= GAME_CONSTANTS.MEDAL_BRONZE) return 'bronze';
  return 'none';
}

export const StorageService = {
  async getHighScore(): Promise<number> {
    try {
      const val = await AsyncStorage.getItem(STORAGE_KEYS.HIGH_SCORE);
      return val ? parseInt(val, 10) : 0;
    } catch {
      return 0;
    }
  },

  async saveHighScore(score: number): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.HIGH_SCORE, score.toString());
    } catch {
      // ignore
    }
  },

  async getSettings(): Promise<GameSettings> {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return json ? { ...DEFAULT_SETTINGS, ...JSON.parse(json) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  async saveSettings(settings: GameSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // ignore
    }
  },

  async getSelectedSkinId(): Promise<string> {
    try {
      const skin = await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_SKIN);
      return skin || 'classic';
    } catch {
      return 'classic';
    }
  },

  async saveSelectedSkinId(skinId: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_SKIN, skinId);
    } catch {
      // ignore
    }
  },

  async getStats(): Promise<GameStats> {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEYS.STATS);
      return json ? { ...DEFAULT_STATS, ...JSON.parse(json) } : DEFAULT_STATS;
    } catch {
      return DEFAULT_STATS;
    }
  },

  async recordGameFinished(
    score: number,
    flaps: number
  ): Promise<{ newHigh: boolean; stats: GameStats }> {
    try {
      const currentStats = await this.getStats();
      const isNewHigh = score > currentStats.highScore;
      const newHighScore = Math.max(currentStats.highScore, score);

      const thisMedal = calculateMedal(score);
      const medalRank: Record<MedalType, number> = {
        none: 0,
        bronze: 1,
        silver: 2,
        gold: 3,
        platinum: 4,
      };

      const bestMedal =
        medalRank[thisMedal] > medalRank[currentStats.bestMedal]
          ? thisMedal
          : currentStats.bestMedal;

      const updatedStats: GameStats = {
        highScore: newHighScore,
        totalGames: currentStats.totalGames + 1,
        totalScore: currentStats.totalScore + score,
        totalFlaps: currentStats.totalFlaps + flaps,
        bestMedal,
        bossesDefeated: currentStats.bossesDefeated || 0,
      };

      await AsyncStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updatedStats));
      if (isNewHigh) {
        await AsyncStorage.setItem(STORAGE_KEYS.HIGH_SCORE, newHighScore.toString());
      }

      return { newHigh: isNewHigh, stats: updatedStats };
    } catch {
      return {
        newHigh: false,
        stats: {
          highScore: score,
          totalGames: 1,
          totalScore: score,
          totalFlaps: flaps,
          bestMedal: calculateMedal(score),
          bossesDefeated: 0,
        },
      };
    }
  },

  async recordBossDefeated(): Promise<GameStats> {
    try {
      const currentStats = await this.getStats();
      const updatedStats: GameStats = {
        ...currentStats,
        bossesDefeated: (currentStats.bossesDefeated || 0) + 1,
      };
      await AsyncStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(updatedStats));
      return updatedStats;
    } catch {
      return DEFAULT_STATS;
    }
  },
};
