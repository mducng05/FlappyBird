import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { BossState } from '@/types/game';

interface BossHUDProps {
  boss: BossState;
  onShootEgg: () => void;
}

export const BossHUD: React.FC<BossHUDProps> = React.memo(({ boss, onShootEgg }) => {
  if (boss.phase === 'none') return null;

  const hpPercent = Math.max(0, Math.min(100, (boss.hp / boss.maxHp) * 100));

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      {/* 1. Boss Warning Banner */}
      {boss.phase === 'warning' && (
        <View style={styles.warningContainer} pointerEvents="none">
          <View style={styles.warningBox}>
            <Text style={styles.warningIcon}>⚠️ ⚠️ ⚠️</Text>
            <Text style={styles.warningTitle}>CẢNH BÁO BOSS</Text>
            <Text style={styles.warningSub}>GIANT MARIO ĐANG GIÁNG LÂM!</Text>
          </View>
        </View>
      )}

      {/* 2. Defeated Banner */}
      {boss.phase === 'defeated' && (
        <View style={styles.defeatedContainer} pointerEvents="none">
          <View style={styles.defeatedBox}>
            <Text style={styles.defeatedTitle}>🎉 CHIẾN THẮNG! 🎉</Text>
            <Text style={styles.defeatedSub}>GIANT MARIO ĐÃ BỊ ĐÁNH BẠI (+20 ĐIỂM)</Text>
          </View>
        </View>
      )}

      {/* 3. Boss Health Bar (Active Phase) */}
      {boss.phase === 'active' && (
        <View style={styles.hpBarContainer} pointerEvents="none">
          <View style={styles.hpCard}>
            <View style={styles.bossAvatar}>
              <Text style={styles.avatarEmoji}>👨🏻‍🔧</Text>
            </View>

            <View style={styles.hpInfo}>
              <View style={styles.hpHeaderRow}>
                <Text style={styles.bossName}>GIANT MARIO</Text>
                <Text style={styles.hpNumbers}>
                  {boss.hp} / {boss.maxHp} HP
                </Text>
              </View>

              <View style={styles.hpTrack}>
                <View
                  style={[
                    styles.hpFill,
                    {
                      width: `${hpPercent}%`,
                      backgroundColor:
                        hpPercent > 50
                          ? '#EF4444'
                          : hpPercent > 25
                          ? '#F97316'
                          : '#DC2626',
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        </View>
      )}

      {/* 4. Shoot Weapon Button on Bottom-Left */}
      {boss.phase === 'active' && (
        <View style={styles.shootButtonContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.shootButton,
              pressed && styles.shootButtonPressed,
            ]}
            onPress={onShootEgg}
            hitSlop={10}>
            <Text style={styles.shootButtonIcon}>🥚</Text>
            <Text style={styles.shootButtonText}>BẮN</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
});

BossHUD.displayName = 'BossHUD';

const styles = StyleSheet.create({
  warningContainer: {
    position: 'absolute',
    top: 130,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 70,
  },
  warningBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.95)',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: '#FEF08A',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  warningIcon: {
    fontSize: 18,
    marginBottom: 2,
  },
  warningTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FEF08A',
    fontFamily: 'monospace',
    letterSpacing: 2,
  },
  warningSub: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  defeatedContainer: {
    position: 'absolute',
    top: 140,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 70,
  },
  defeatedBox: {
    backgroundColor: 'rgba(34, 197, 94, 0.95)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  defeatedTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: 'monospace',
  },
  defeatedSub: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FEF08A',
    marginTop: 4,
  },
  hpBarContainer: {
    position: 'absolute',
    top: 86,
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 45,
  },
  hpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#DC2626',
    gap: 10,
    width: '100%',
    maxWidth: 320,
  },
  bossAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  avatarEmoji: {
    fontSize: 18,
  },
  hpInfo: {
    flex: 1,
  },
  hpHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  bossName: {
    fontSize: 12,
    fontWeight: '900',
    color: '#F87171',
    fontFamily: 'monospace',
  },
  hpNumbers: {
    fontSize: 10,
    fontWeight: '800',
    color: '#CBD5E1',
    fontFamily: 'monospace',
  },
  hpTrack: {
    height: 10,
    backgroundColor: '#334155',
    borderRadius: 5,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#475569',
  },
  hpFill: {
    height: '100%',
    borderRadius: 5,
  },
  shootButtonContainer: {
    position: 'absolute',
    bottom: 125, // Just above ground
    left: 16,
    zIndex: 55,
  },
  shootButton: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#EAB308',
    borderWidth: 3,
    borderColor: '#854D0E',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 6,
  },
  shootButtonPressed: {
    transform: [{ scale: 0.92 }],
    backgroundColor: '#CA8A04',
  },
  shootButtonIcon: {
    fontSize: 22,
    lineHeight: 24,
  },
  shootButtonText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#713F12',
    fontFamily: 'monospace',
  },
});
