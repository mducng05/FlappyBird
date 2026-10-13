import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { GameStats } from '@/types/game';

interface StatsModalProps {
  visible: boolean;
  stats: GameStats;
  onClose: () => void;
}

export const StatsModal: React.FC<StatsModalProps> = React.memo(({ visible, stats, onClose }) => {
  if (!visible) return null;

  const avgScore =
    stats.totalGames > 0
      ? (stats.totalScore / stats.totalGames).toFixed(1)
      : '0';

  const medalEmojis: Record<string, string> = {
    none: 'Chưa có',
    bronze: '🥉 Đồng',
    silver: '🥈 Bạc',
    gold: '🥇 Vàng',
    platinum: '💎 Bạch Kim',
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>THỐNG KÊ CHIẾN TÍCH</Text>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}>
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </View>

        {/* Stats Grid */}
        <View style={styles.content}>
          <View style={styles.statGrid}>
            <View style={styles.statTile}>
              <Text style={styles.statLabel}>🏆 KỶ LỤC ĐIỂM</Text>
              <Text style={[styles.statValue, { color: '#E06D14' }]}>
                {stats.highScore}
              </Text>
            </View>

            <View style={styles.statTile}>
              <Text style={styles.statLabel}>🎮 TỔNG SỐ LƯỢT</Text>
              <Text style={styles.statValue}>{stats.totalGames}</Text>
            </View>

            <View style={styles.statTile}>
              <Text style={styles.statLabel}>⭐ TỔNG ĐIỂM ĐẠT</Text>
              <Text style={styles.statValue}>{stats.totalScore}</Text>
            </View>

            <View style={styles.statTile}>
              <Text style={styles.statLabel}>📊 ĐIỂM TRUNG BÌNH</Text>
              <Text style={styles.statValue}>{avgScore}</Text>
            </View>

            <View style={styles.statTile}>
              <Text style={styles.statLabel}>🪶 TỔNG ĐẬP CÁNH</Text>
              <Text style={styles.statValue}>{stats.totalFlaps}</Text>
            </View>

            <View style={styles.statTile}>
              <Text style={styles.statLabel}>🏅 HUY CHƯƠNG CAO NHẤT</Text>
              <Text style={[styles.statValue, { fontSize: 16 }]}>
                {medalEmojis[stats.bestMedal] || 'Chưa có'}
              </Text>
            </View>

            <View style={[styles.statTile, { width: '100%' }]}>
              <Text style={styles.statLabel}>👨🏻‍🔧 BOSS MARIO ĐÃ HẠ GỤC</Text>
              <Text style={[styles.statValue, { color: '#DC2626' }]}>
                {stats.bossesDefeated || 0}
              </Text>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [styles.okButton, pressed && styles.pressed]}
            onPress={onClose}>
            <Text style={styles.okButtonText}>Đóng</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
});

StatsModal.displayName = 'StatsModal';

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#3F2212',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#38BDF8',
    borderBottomWidth: 3,
    borderBottomColor: '#3F2212',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0C4A6E',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#0C4A6E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statTile: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    marginBottom: 4,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1E293B',
    fontFamily: 'monospace',
  },
  okButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#15803D',
    alignItems: 'center',
  },
  okButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  pressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
});
