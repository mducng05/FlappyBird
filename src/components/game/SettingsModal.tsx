import React from 'react';
import { View, Text, StyleSheet, Pressable, Switch } from 'react-native';
import { GameSettings } from '@/types/game';

interface SettingsModalProps {
  visible: boolean;
  settings: GameSettings;
  onUpdateSettings: (settings: GameSettings) => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = React.memo(
  ({ visible, settings, onUpdateSettings, onClose }) => {
    if (!visible) return null;

    const setDifficulty = (difficulty: 'easy' | 'normal' | 'hard') => {
      onUpdateSettings({ ...settings, difficulty });
    };

    const setTheme = (theme: 'day' | 'night' | 'auto') => {
      onUpdateSettings({ ...settings, theme });
    };

    return (
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>CÀI ĐẶT TRÒ CHƠI</Text>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          <View style={styles.content}>
            {/* Sound Toggle */}
            <View style={styles.settingRow}>
              <View>
                <Text style={styles.settingLabel}>🔊 Âm Thanh</Text>
                <Text style={styles.settingSub}>Hiệu ứng tiếng đập cánh, chuông điểm</Text>
              </View>
              <Switch
                value={settings.soundEnabled}
                onValueChange={(val) =>
                  onUpdateSettings({ ...settings, soundEnabled: val })
                }
                trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
                thumbColor={settings.soundEnabled ? '#16A34A' : '#F1F5F9'}
              />
            </View>

            {/* Haptics Toggle */}
            <View style={styles.settingRow}>
              <View>
                <Text style={styles.settingLabel}>📳 Rung Phản Hồi</Text>
                <Text style={styles.settingSub}>Rung khi chạm, ghi điểm, va chạm</Text>
              </View>
              <Switch
                value={settings.hapticsEnabled}
                onValueChange={(val) =>
                  onUpdateSettings({ ...settings, hapticsEnabled: val })
                }
                trackColor={{ false: '#CBD5E1', true: '#86EFAC' }}
                thumbColor={settings.hapticsEnabled ? '#16A34A' : '#F1F5F9'}
              />
            </View>

            {/* Boss Mode Toggle */}
            <View style={styles.settingRow}>
              <View>
                <Text style={styles.settingLabel}>👾 Boss Mario Đại Chiến</Text>
                <Text style={styles.settingSub}>Xuất hiện khi đạt 10 điểm (bắn laze & ném nấm)</Text>
              </View>
              <Switch
                value={settings.bossModeEnabled}
                onValueChange={(val) =>
                  onUpdateSettings({ ...settings, bossModeEnabled: val })
                }
                trackColor={{ false: '#CBD5E1', true: '#FCA5A5' }}
                thumbColor={settings.bossModeEnabled ? '#DC2626' : '#F1F5F9'}
              />
            </View>

            {/* Difficulty selector */}
            <View style={styles.sectionBlock}>
              <Text style={styles.settingLabel}>⚡ Độ Khó</Text>
              <View style={styles.pillGroup}>
                {(['easy', 'normal', 'hard'] as const).map((level) => {
                  const labels = { easy: 'Dễ', normal: 'Vừa', hard: 'Khó' };
                  const isSelected = settings.difficulty === level;
                  return (
                    <Pressable
                      key={level}
                      onPress={() => setDifficulty(level)}
                      style={[
                        styles.pillOption,
                        isSelected && styles.pillOptionActive,
                      ]}>
                      <Text
                        style={[
                          styles.pillText,
                          isSelected && styles.pillTextActive,
                        ]}>
                        {labels[level]}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Theme selector */}
            <View style={styles.sectionBlock}>
              <Text style={styles.settingLabel}>⛅ Khung Cảnh Trời</Text>
              <View style={styles.pillGroup}>
                {(['day', 'night', 'auto'] as const).map((t) => {
                  const labels = {
                    day: '☀️ Ban Ngày',
                    night: '🌙 Ban Đêm',
                    auto: '⏱️ Tự Động',
                  };
                  const isSelected = settings.theme === t;
                  return (
                    <Pressable
                      key={t}
                      onPress={() => setTheme(t)}
                      style={[
                        styles.pillOption,
                        isSelected && styles.pillOptionActive,
                      ]}>
                      <Text
                        style={[
                          styles.pillText,
                          isSelected && styles.pillTextActive,
                        ]}>
                        {labels[t]}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Close Button */}
            <Pressable
              style={({ pressed }) => [styles.doneButton, pressed && styles.pressed]}
              onPress={onClose}>
              <Text style={styles.doneButtonText}>Xong</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }
);

SettingsModal.displayName = 'SettingsModal';

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
    backgroundColor: '#F59E0B',
    borderBottomWidth: 3,
    borderBottomColor: '#3F2212',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#451A03',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#451A03',
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
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
  },
  settingSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    maxWidth: 200,
  },
  sectionBlock: {
    gap: 8,
  },
  pillGroup: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    padding: 4,
    gap: 4,
  },
  pillOption: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  pillOptionActive: {
    backgroundColor: '#E06D14',
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  pillTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  doneButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#15803D',
    alignItems: 'center',
    marginTop: 4,
  },
  doneButtonText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  pressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
});
