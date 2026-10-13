import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BirdSkin, BirdState } from '@/types/game';
import { GAME_CONSTANTS } from '@/constants/gameConfig';

interface BirdViewProps {
  bird: BirdState;
  skin: BirdSkin;
}

export const BirdView: React.FC<BirdViewProps> = React.memo(({ bird, skin }) => {
  // Wing offsets based on wingFrame
  const wingTranslateY =
    bird.wingFrame === 0 ? 3 : bird.wingFrame === 2 ? -4 : 0;
  const wingRotate =
    bird.wingFrame === 0 ? '18deg' : bird.wingFrame === 2 ? '-20deg' : '0deg';

  return (
    <View
      style={[
        styles.container,
        {
          left: GAME_CONSTANTS.BIRD_X,
          top: bird.y,
          transform: [{ rotate: `${bird.rotation}deg` }],
        },
      ]}>
      {/* Bird Body */}
      <View
        style={[
          styles.body,
          {
            backgroundColor: skin.bodyColor,
            borderColor: skin.outlineColor,
          },
        ]}>
        {/* Belly highlight */}
        <View
          style={[
            styles.belly,
            {
              backgroundColor: skin.bellyColor,
            },
          ]}
        />

        {/* Eye */}
        <View style={styles.eyeOuter}>
          <View
            style={[
              styles.eyePupil,
              {
                backgroundColor: skin.eyeColor,
              },
            ]}>
            <View style={styles.eyeGlint} />
          </View>
        </View>

        {/* Cheek Blush */}
        <View style={styles.blush} />

        {/* Beak / Bill */}
        <View
          style={[
            styles.beakUpper,
            {
              backgroundColor: skin.beakColor,
              borderColor: skin.outlineColor,
            },
          ]}
        />
        <View
          style={[
            styles.beakLower,
            {
              backgroundColor: skin.beakColor,
              borderColor: skin.outlineColor,
            },
          ]}
        />

        {/* Wing with animated frame */}
        <View
          style={[
            styles.wing,
            {
              backgroundColor: skin.wingColor,
              borderColor: skin.outlineColor,
              transform: [
                { translateY: wingTranslateY },
                { rotate: wingRotate },
              ],
            },
          ]}
        />
      </View>
    </View>
  );
});

BirdView.displayName = 'BirdView';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: GAME_CONSTANTS.BIRD_WIDTH,
    height: GAME_CONSTANTS.BIRD_HEIGHT,
    zIndex: 20,
  },
  body: {
    width: '100%',
    height: '100%',
    borderRadius: 14,
    borderWidth: 2,
    position: 'relative',
    overflow: 'visible',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
  },
  belly: {
    position: 'absolute',
    bottom: 2,
    left: 4,
    width: 18,
    height: 10,
    borderRadius: 8,
    opacity: 0.85,
  },
  eyeOuter: {
    position: 'absolute',
    top: 3,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eyePupil: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    position: 'relative',
  },
  eyeGlint: {
    position: 'absolute',
    top: 0.5,
    right: 0.5,
    width: 1.5,
    height: 1.5,
    borderRadius: 1,
    backgroundColor: '#FFFFFF',
  },
  blush: {
    position: 'absolute',
    bottom: 5,
    right: 9,
    width: 6,
    height: 4,
    borderRadius: 3,
    backgroundColor: '#F87171',
    opacity: 0.6,
  },
  beakUpper: {
    position: 'absolute',
    top: 7,
    right: -7,
    width: 11,
    height: 7,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 2,
    borderWidth: 1.5,
  },
  beakLower: {
    position: 'absolute',
    top: 13,
    right: -5,
    width: 8,
    height: 5,
    borderBottomRightRadius: 4,
    borderWidth: 1.5,
  },
  wing: {
    position: 'absolute',
    top: 7,
    left: 3,
    width: 16,
    height: 11,
    borderRadius: 7,
    borderWidth: 1.5,
  },
});
