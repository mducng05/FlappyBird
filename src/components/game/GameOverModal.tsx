import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MedalType } from '@/types/game';
import { GAME_CONSTANTS } from '@/constants/gameConfig';

interface GameOverModalProps {
  score: number;
  highScore: number;
  isNewHighScore: boolean;
  onRestart: () => void;
  onOpenSkins: () => void;
  onOpenStats: () => void;
}

function getMedal(score: number): MedalType {
  if (score >= GAME_CONSTANTS.MEDAL_PLATINUM) return 'platinum';
  if (score >= GAME_CONSTANTS.MEDAL_GOLD) return 'gold';
  if (score >= GAME_CONSTANTS.MEDAL_SILVER) return 'silver';
  if (score >= GAME_CONSTANTS.MEDAL_BRONZE) return 'bronze';
  return 'none';
}

export const GameOverModal: React.FC<GameOverModalProps> = React.memo(
  ({
    score,
    highScore,
    isNewHighScore,
    onRestart,
    onOpenSkins,
    onOpenStats,
  }) => {
    const medal = getMedal(score);

    const medalColors: Record<MedalType, { bg: string; border: string; label: string; icon: string }> = {
      none: { bg: '#E2E8F0', border: '#CBD5E1', label: 'Chưa có', icon: '⚪' },
      bronze: { bg: '#CD7F32', border: '#78350F', label: 'Đồng', icon: '🥉' },
      silver: { bg: '#E2E8F0', border: '#64748B', label: 'Bạc', icon: '🥈' },
      gold: { bg: '#FBBF24', border: '#B45309', label: 'Vàng', icon: '🥇' },
      platinum: { bg: '#38BDF8', border: '#0369A1', label: 'Bạch Kim', icon: '💎' },
    };

    const currentMedalConfig = medalColors[medal];

    return (
      <View style={styles.overlay} pointerEvents="box-none">
        {/* GAME OVER Header */}
        <View style={styles.titleWrapper}>
          <Text style={styles.titleStroke}>GAME OVER</Text>
          <Text style={styles.titleMain}>GAME OVER</Text>
        </View>

        {/* Score Board Panel */}
        <View style={styles.boardContainer}>
          <View style={styles.boardInner}>
            {/* Left side: Medal Box */}
            <View style={styles.medalSection}>
              <Text style={styles.sectionHeader}>HUY CHƯƠNG</Text>
              <View
                style={[
                  styles.medalCircle,
                  {
                    backgroundColor: currentMedalConfig.bg,
                    borderColor: currentMedalConfig.border,
                  },
                ]}>
                <Text style={styles.medalEmoji}>{currentMedalConfig.icon}</Text>
              </View>
              <Text style={styles.medalLabel}>{currentMedalConfig.label}</Text>
            </View>

            {/* Right side: Scores */}
            <View style={styles.scoreSection}>
              {/* Current Score */}
              <View style={styles.scoreRow}>
                <Text style={styles.sectionHeader}>ĐIỂM SỐ</Text>
                <Text style={styles.scoreValue}>{score}</Text>
              </View>

              {/* Best Score */}
              <View style={styles.scoreRow}>
                <View style={styles.bestHeaderRow}>
                  <Text style={styles.sectionHeader}>KỶ LỤC</Text>
                  {isNewHighScore && (
                    <View style={styles.newBadge}>
                      <Text style={styles.newBadgeText}>MỚI!</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.scoreValue}>{highScore}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonGroup}>
          <Pressable
            style={({ pressed }) => [
              styles.playAgainButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={onRestart}>
            <Text style={styles.playAgainText}>▶ CHƠI LẠI</Text>
          </Pressable>

          <View style={styles.subButtonsRow}>
            <Pressable
              style={({ pressed }) => [
                styles.subButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={onOpenSkins}>
              <Text style={styles.subButtonText}>🎨 Đổi Chim</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.subButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={onOpenStats}>
              <Text style={styles.subButtonText}>📊 Thống Kê</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }
);

GameOverModal.displayName = 'GameOverModal';

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 20,
  },
  titleWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  titleStroke: {
    position: 'absolute',
    fontSize: 42,
    fontWeight: '900',
    color: '#3F2212',
    letterSpacing: 2,
    fontFamily: 'monospace',
    textShadowColor: '#3F2212',
    textShadowOffset: { width: 3, height: 4 },
    textShadowRadius: 1,
  },
  titleMain: {
    fontSize: 42,
    fontWeight: '900',
    color: '#EF4444',
    letterSpacing: 2,
    fontFamily: 'monospace',
  },
  boardContainer: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#DED895',
    borderRadius: 14,
    borderWidth: 4,
    borderColor: '#543847',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 8,
  },
  boardInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  medalSection: {
    alignItems: 'center',
    width: 90,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '900',
    color: '#E06D14',
    letterSpacing: 1,
    marginBottom: 6,
    fontFamily: 'monospace',
  },
  medalCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 2,
  },
  medalEmoji: {
    fontSize: 24,
  },
  medalLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#543847',
    marginTop: 4,
  },
  scoreSection: {
    flex: 1,
    paddingLeft: 16,
    gap: 12,
  },
  scoreRow: {
    alignItems: 'flex-end',
  },
  bestHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  newBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  newBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: '900',
    color: '#543847',
    fontFamily: 'monospace',
  },
  buttonGroup: {
    width: '100%',
    maxWidth: 320,
    marginTop: 24,
    gap: 10,
  },
  playAgainButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: '#14532D',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
  },
  playAgainText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    fontFamily: 'monospace',
  },
  subButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  subButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#543847',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  subButtonText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#543847',
  },
  buttonPressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
});
