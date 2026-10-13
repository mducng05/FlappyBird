import React from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { BirdSkin } from '@/types/game';

interface GetReadyViewProps {
  highScore: number;
  currentSkin: BirdSkin;
  onOpenSkins: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
  onStartBossBattle?: () => void;
}

export const GetReadyView: React.FC<GetReadyViewProps> = React.memo(
  ({
    highScore,
    currentSkin,
    onOpenSkins,
    onOpenStats,
    onOpenSettings,
    onStartBossBattle,
  }) => {
    return (
      <View style={styles.container} pointerEvents="box-none">
        {/* Title Header */}
        <View style={styles.titleWrapper}>
          <Text style={styles.titleStroke}>FLAPPY BIRD</Text>
          <Text style={styles.titleMain}>FLAPPY BIRD</Text>
        </View>

        {/* GET READY Badge */}
        <View style={styles.badgeWrapper}>
          <View style={styles.badgeBanner}>
            <Text style={styles.badgeText}>SẴN SÀNG!</Text>
          </View>
        </View>

        {/* Tap Instruction Icon */}
        <View style={styles.instructionBox}>
          <View style={styles.tapHandCircle}>
            <Text style={styles.tapIconEmoji}>👆</Text>
          </View>
          <Text style={styles.instructionText}>
            {Platform.OS === 'web'
              ? 'Chạm màn hình hoặc bấm SPACE để bay'
              : 'Chạm vào màn hình để đập cánh'}
          </Text>
        </View>

        {/* Bottom Menu Buttons */}
        <View style={styles.bottomBar}>
          {/* High score chip */}
          <View style={styles.highScoreChip}>
            <Text style={styles.highScoreLabel}>🏆 KỶ LỤC</Text>
            <Text style={styles.highScoreValue}>{highScore}</Text>
          </View>

          {/* Skin selector button */}
          <Pressable
            style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
            onPress={onOpenSkins}>
            <View
              style={[
                styles.skinPreviewDot,
                { backgroundColor: currentSkin.bodyColor, borderColor: currentSkin.outlineColor },
              ]}
            />
            <Text style={styles.actionButtonText}>Đổi Chim</Text>
          </Pressable>

          {/* Stats Button */}
          <Pressable
            style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
            onPress={onOpenStats}>
            <Text style={styles.actionButtonIcon}>📊</Text>
            <Text style={styles.actionButtonText}>Thống kê</Text>
          </Pressable>

          {/* Boss Battle Button */}
          {onStartBossBattle && (
            <Pressable
              style={({ pressed }) => [
                styles.actionButton,
                styles.bossButton,
                pressed && styles.pressed,
              ]}
              onPress={onStartBossBattle}>
              <Text style={styles.actionButtonIcon}>🍄</Text>
              <Text style={[styles.actionButtonText, styles.bossButtonText]}>
                Đấu Boss
              </Text>
            </Pressable>
          )}

          {/* Settings Button */}
          <Pressable
            style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
            onPress={onOpenSettings}>
            <Text style={styles.actionButtonIcon}>⚙️</Text>
            <Text style={styles.actionButtonText}>Cài đặt</Text>
          </Pressable>
        </View>
      </View>
    );
  }
);

GetReadyView.displayName = 'GetReadyView';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 130, // Just above ground
  },
  titleWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleStroke: {
    position: 'absolute',
    fontSize: 38,
    fontWeight: '900',
    color: '#3F2212',
    letterSpacing: 2,
    fontFamily: 'monospace',
    textShadowColor: '#3F2212',
    textShadowOffset: { width: 3, height: 4 },
    textShadowRadius: 1,
  },
  titleMain: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FBBF24',
    letterSpacing: 2,
    fontFamily: 'monospace',
  },
  badgeWrapper: {
    marginVertical: 10,
  },
  badgeBanner: {
    backgroundColor: '#E06D14',
    paddingVertical: 6,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 20,
    letterSpacing: 1,
    fontFamily: 'monospace',
  },
  instructionBox: {
    alignItems: 'center',
    gap: 12,
  },
  tapHandCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 2.5,
    borderColor: '#E06D14',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tapIconEmoji: {
    fontSize: 28,
  },
  instructionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingVertical: 5,
    paddingHorizontal: 14,
    borderRadius: 16,
    overflow: 'hidden',
    textAlign: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
  },
  highScoreChip: {
    backgroundColor: '#FEF08A',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#854D0E',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  highScoreLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#854D0E',
  },
  highScoreValue: {
    fontSize: 14,
    fontWeight: '900',
    color: '#854D0E',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#3F2212',
    gap: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  pressed: {
    transform: [{ scale: 0.94 }],
    opacity: 0.9,
  },
  skinPreviewDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
  },
  actionButtonIcon: {
    fontSize: 12,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#3F2212',
  },
  bossButton: {
    backgroundColor: '#FEF2F2',
    borderColor: '#DC2626',
  },
  bossButtonText: {
    color: '#DC2626',
    fontWeight: '900',
  },
});
