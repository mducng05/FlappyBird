import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GAME_CONSTANTS } from '@/constants/gameConfig';

interface GroundViewProps {
  offset: number;
}

export const GroundView: React.FC<GroundViewProps> = React.memo(({ offset }) => {
  // Generate diagonal stripes for scrolling effect
  const stripeWidth = 24;
  const numStripes = Math.ceil((GAME_CONSTANTS.CANVAS_WIDTH + 60) / stripeWidth);

  return (
    <View style={styles.container}>
      {/* Grass upper rim */}
      <View style={styles.grassContainer}>
        <View style={styles.grassRim} />
        {/* Scrolling grass teeth */}
        <View
          style={[
            styles.stripesRow,
            {
              transform: [{ translateX: -offset }],
            },
          ]}>
          {Array.from({ length: numStripes }).map((_, i) => (
            <View key={i} style={styles.grassStripe}>
              <View style={styles.grassTooth} />
            </View>
          ))}
        </View>
      </View>

      {/* Dirt body */}
      <View style={styles.dirtBody}>
        {/* Dirt texture patterns */}
        <View
          style={[
            styles.stripesRow,
            {
              transform: [{ translateX: -offset }],
            },
          ]}>
          {Array.from({ length: numStripes }).map((_, i) => (
            <View key={i} style={styles.dirtPatternUnit}>
              <View style={styles.dirtDot1} />
              <View style={styles.dirtDot2} />
              <View style={styles.dirtStripeDark} />
            </View>
          ))}
        </View>
      </View>

      {/* Top Border Line separating ground from play area */}
      <View style={styles.topBorderLine} />
    </View>
  );
});

GroundView.displayName = 'GroundView';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: GAME_CONSTANTS.GROUND_HEIGHT,
    zIndex: 30,
    overflow: 'hidden',
  },
  topBorderLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#3F2212',
  },
  grassContainer: {
    height: 16,
    backgroundColor: '#73BF2E',
    overflow: 'hidden',
  },
  grassRim: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#9DE64E',
  },
  stripesRow: {
    flexDirection: 'row',
    width: GAME_CONSTANTS.CANVAS_WIDTH + 100,
  },
  grassStripe: {
    width: 24,
    height: 16,
    position: 'relative',
  },
  grassTooth: {
    position: 'absolute',
    top: 4,
    left: 6,
    width: 10,
    height: 10,
    backgroundColor: '#558022',
    transform: [{ rotate: '45deg' }],
  },
  dirtBody: {
    flex: 1,
    backgroundColor: '#DDD894',
    borderTopWidth: 2,
    borderTopColor: '#CBBF72',
  },
  dirtPatternUnit: {
    width: 24,
    height: 80,
    position: 'relative',
  },
  dirtDot1: {
    position: 'absolute',
    top: 12,
    left: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#BFA85D',
  },
  dirtDot2: {
    position: 'absolute',
    top: 26,
    left: 14,
    width: 5,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#C5B26E',
  },
  dirtStripeDark: {
    position: 'absolute',
    top: 48,
    left: 8,
    width: 8,
    height: 2,
    backgroundColor: '#A8944A',
  },
});
