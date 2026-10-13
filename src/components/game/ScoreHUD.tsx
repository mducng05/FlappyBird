import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

interface ScoreHUDProps {
  score: number;
  onPause: () => void;
  isPaused: boolean;
}

export const ScoreHUD: React.FC<ScoreHUDProps> = React.memo(({ score, onPause, isPaused }) => {
  return (
    <View style={styles.container} pointerEvents="box-none">
      {/* Top Header Row with Pause Button */}
      <View style={styles.topRow} pointerEvents="box-none">
        <View style={styles.spacer} />

        {/* Center Score Numbers */}
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreStroke}>{score}</Text>
          <Text style={styles.scoreMain}>{score}</Text>
        </View>

        {/* Pause Button */}
        <Pressable
          style={({ pressed }) => [styles.pauseButton, pressed && styles.pressed]}
          onPress={onPause}
          hitSlop={12}>
          <View style={styles.pauseIconContainer}>
            {isPaused ? (
              // Play triangle
              <View style={styles.playIcon} />
            ) : (
              // Two pause bars
              <View style={styles.pauseBars}>
                <View style={styles.pauseBar} />
                <View style={styles.pauseBar} />
              </View>
            )}
          </View>
        </Pressable>
      </View>
    </View>
  );
});

ScoreHUD.displayName = 'ScoreHUD';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 36,
    left: 0,
    right: 0,
    zIndex: 40,
    alignItems: 'center',
  },
  topRow: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  spacer: {
    width: 36,
  },
  scoreContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreStroke: {
    position: 'absolute',
    fontSize: 54,
    fontWeight: '900',
    color: '#000000',
    fontFamily: 'monospace',
    textShadowColor: '#000000',
    textShadowOffset: { width: 3, height: 3 },
    textShadowRadius: 1,
  },
  scoreMain: {
    fontSize: 54,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: 'monospace',
  },
  pauseButton: {
    width: 38,
    height: 38,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 2,
    borderColor: '#3F2212',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
  },
  pressed: {
    transform: [{ scale: 0.93 }],
    opacity: 0.85,
  },
  pauseIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseBars: {
    flexDirection: 'row',
    gap: 4,
  },
  pauseBar: {
    width: 4,
    height: 14,
    backgroundColor: '#E06D14',
    borderRadius: 1,
  },
  playIcon: {
    width: 0,
    height: 0,
    borderLeftWidth: 12,
    borderTopWidth: 7,
    borderBottomWidth: 7,
    borderLeftColor: '#E06D14',
    borderTopColor: 'transparent',
    borderBottomColor: 'transparent',
    marginLeft: 2,
  },
});
