import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

interface PauseModalProps {
  visible: boolean;
  soundEnabled: boolean;
  onResume: () => void;
  onRestart: () => void;
  onToggleSound: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = React.memo(
  ({ visible, soundEnabled, onResume, onRestart, onToggleSound }) => {
    if (!visible) return null;

    return (
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>TẠM DỪNG</Text>

          <View style={styles.buttons}>
            {/* Resume */}
            <Pressable
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressed,
              ]}
              onPress={onResume}>
              <Text style={styles.primaryText}>▶ TIẾP TỤC</Text>
            </Pressable>

            {/* Restart */}
            <Pressable
              style={({ pressed }) => [
                styles.secondaryButton,
                pressed && styles.pressed,
              ]}
              onPress={onRestart}>
              <Text style={styles.secondaryText}>🔄 CHƠI LẠI</Text>
            </Pressable>

            {/* Sound toggle button */}
            <Pressable
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.pressed,
              ]}
              onPress={onToggleSound}>
              <Text style={styles.iconButtonText}>
                {soundEnabled ? '🔊 Âm Thanh: BẬT' : '🔇 Âm Thanh: TẮT'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }
);

PauseModal.displayName = 'PauseModal';

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 90,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 3,
    borderColor: '#3F2212',
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#3F2212',
    fontFamily: 'monospace',
    marginBottom: 20,
    letterSpacing: 2,
  },
  buttons: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#15803D',
    alignItems: 'center',
  },
  primaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  secondaryButton: {
    backgroundColor: '#F97316',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#C2410C',
    alignItems: 'center',
  },
  secondaryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  iconButton: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
  },
  iconButtonText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '700',
  },
  pressed: {
    transform: [{ scale: 0.96 }],
    opacity: 0.9,
  },
});
