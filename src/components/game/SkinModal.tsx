import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { BirdSkin } from '@/types/game';
import { BIRD_SKINS } from '@/constants/skins';

interface SkinModalProps {
  visible: boolean;
  highScore: number;
  currentSkin: BirdSkin;
  onSelectSkin: (skin: BirdSkin) => void;
  onClose: () => void;
}

export const SkinModal: React.FC<SkinModalProps> = React.memo(
  ({ visible, highScore, currentSkin, onSelectSkin, onClose }) => {
    if (!visible) return null;

    return (
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>CHỌN TRANG PHỤC</Text>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [styles.closeButton, pressed && styles.pressed]}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          {/* Skins List */}
          <ScrollView contentContainerStyle={styles.scrollList}>
            {BIRD_SKINS.map((skin) => {
              const isUnlocked = highScore >= skin.requiredScore;
              const isSelected = currentSkin.id === skin.id;

              return (
                <View
                  key={skin.id}
                  style={[
                    styles.skinItem,
                    isSelected && styles.skinItemSelected,
                    !isUnlocked && styles.skinItemLocked,
                  ]}>
                  {/* Skin Avatar Preview */}
                  <View
                    style={[
                      styles.avatarBox,
                      {
                        backgroundColor: skin.bodyColor,
                        borderColor: skin.outlineColor,
                      },
                    ]}>
                    <View
                      style={[
                        styles.avatarBelly,
                        { backgroundColor: skin.bellyColor },
                      ]}
                    />
                    <View style={styles.avatarEye}>
                      <View
                        style={[
                          styles.avatarPupil,
                          { backgroundColor: skin.eyeColor },
                        ]}
                      />
                    </View>
                    <View
                      style={[
                        styles.avatarBeak,
                        {
                          backgroundColor: skin.beakColor,
                          borderColor: skin.outlineColor,
                        },
                      ]}
                    />
                    <View
                      style={[
                        styles.avatarWing,
                        {
                          backgroundColor: skin.wingColor,
                          borderColor: skin.outlineColor,
                        },
                      ]}
                    />
                  </View>

                  {/* Skin Info */}
                  <View style={styles.skinInfo}>
                    <View style={styles.skinNameRow}>
                      <Text style={styles.skinName}>{skin.name}</Text>
                      {isSelected && (
                        <View style={styles.activeBadge}>
                          <Text style={styles.activeBadgeText}>ĐANG DÙNG</Text>
                        </View>
                      )}
                    </View>
                    <Text style={styles.skinDescription}>
                      {isUnlocked
                        ? skin.description
                        : `🔒 Cần đạt ${skin.requiredScore} điểm để mở khóa`}
                    </Text>
                  </View>

                  {/* Action Button */}
                  <Pressable
                    disabled={!isUnlocked || isSelected}
                    onPress={() => onSelectSkin(skin)}
                    style={({ pressed }) => [
                      styles.selectButton,
                      isSelected && styles.selectButtonActive,
                      !isUnlocked && styles.selectButtonLocked,
                      pressed && isUnlocked && !isSelected && styles.pressed,
                    ]}>
                    <Text
                      style={[
                        styles.selectButtonText,
                        isSelected && styles.selectButtonTextActive,
                      ]}>
                      {isSelected ? '✓ Đang dùng' : isUnlocked ? 'Chọn' : 'Khóa'}
                    </Text>
                  </Pressable>
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    );
  }
);

SkinModal.displayName = 'SkinModal';

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
    maxHeight: '80%',
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
    backgroundColor: '#FDE047',
    borderBottomWidth: 3,
    borderBottomColor: '#3F2212',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#3F2212',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  closeButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#3F2212',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  scrollList: {
    padding: 12,
    gap: 10,
  },
  skinItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  skinItemSelected: {
    borderColor: '#22C55E',
    backgroundColor: '#F0FDF4',
  },
  skinItemLocked: {
    opacity: 0.65,
    backgroundColor: '#F1F5F9',
  },
  avatarBox: {
    width: 44,
    height: 32,
    borderRadius: 14,
    borderWidth: 2,
    position: 'relative',
    overflow: 'visible',
  },
  avatarBelly: {
    position: 'absolute',
    bottom: 2,
    left: 4,
    width: 14,
    height: 8,
    borderRadius: 6,
  },
  avatarEye: {
    position: 'absolute',
    top: 3,
    right: 9,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarPupil: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  avatarBeak: {
    position: 'absolute',
    top: 9,
    right: -6,
    width: 9,
    height: 7,
    borderTopRightRadius: 5,
    borderWidth: 1,
  },
  avatarWing: {
    position: 'absolute',
    top: 7,
    left: 4,
    width: 14,
    height: 10,
    borderRadius: 6,
    borderWidth: 1,
  },
  skinInfo: {
    flex: 1,
  },
  skinNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  skinName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  activeBadge: {
    backgroundColor: '#22C55E',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  activeBadgeText: {
    fontSize: 8,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  skinDescription: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  selectButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#E06D14',
    borderWidth: 1.5,
    borderColor: '#9A3412',
  },
  selectButtonActive: {
    backgroundColor: '#E2E8F0',
    borderColor: '#94A3B8',
  },
  selectButtonLocked: {
    backgroundColor: '#94A3B8',
    borderColor: '#64748B',
  },
  selectButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  selectButtonTextActive: {
    color: '#475569',
  },
  pressed: {
    transform: [{ scale: 0.95 }],
    opacity: 0.85,
  },
});
