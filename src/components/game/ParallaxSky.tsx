import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GAME_CONSTANTS } from '@/constants/gameConfig';

interface ParallaxSkyProps {
  offset: number;
  theme: 'day' | 'night' | 'auto';
}

export const ParallaxSky: React.FC<ParallaxSkyProps> = React.memo(({ offset, theme }) => {
  // Determine if day or night
  const isNight =
    theme === 'night' ||
    (theme === 'auto' &&
      (new Date().getHours() >= 18 || new Date().getHours() < 6));

  const skyColor = isNight ? '#0B132B' : '#4EC0CA';

  return (
    <View style={[styles.container, { backgroundColor: skyColor }]}>
      {/* Celestial Body: Sun or Moon */}
      {isNight ? (
        <View style={styles.moon}>
          <View style={styles.moonCrater1} />
          <View style={styles.moonCrater2} />
        </View>
      ) : (
        <View style={styles.sun} />
      )}

      {/* Stars (Night mode) */}
      {isNight && (
        <>
          <View style={[styles.star, { top: 40, left: 50, opacity: 0.8 }]} />
          <View style={[styles.star, { top: 75, left: 140, opacity: 0.5 }]} />
          <View style={[styles.star, { top: 30, left: 220, opacity: 0.9 }]} />
          <View style={[styles.star, { top: 110, left: 290, opacity: 0.7 }]} />
          <View style={[styles.star, { top: 160, left: 80, opacity: 0.6 }]} />
          <View style={[styles.star, { top: 90, left: 20, opacity: 0.7 }]} />
        </>
      )}

      {/* Parallax Moving Clouds */}
      <View
        style={[
          styles.cloudsRow,
          {
            transform: [{ translateX: -offset }],
          },
        ]}>
        {/* Repeating cloud cluster */}
        {[0, 360].map((baseX) => (
          <View key={baseX} style={[styles.cloudGroup, { left: baseX }]}>
            {/* Cloud 1 */}
            <View style={[styles.cloud, { top: 60, left: 20, width: 90, height: 32 }]}>
              <View style={[styles.cloudPuff, { top: -14, left: 15, width: 36, height: 36 }]} />
              <View style={[styles.cloudPuff, { top: -20, left: 35, width: 44, height: 44 }]} />
            </View>

            {/* Cloud 2 */}
            <View style={[styles.cloud, { top: 130, left: 180, width: 110, height: 36 }]}>
              <View style={[styles.cloudPuff, { top: -16, left: 20, width: 40, height: 40 }]} />
              <View style={[styles.cloudPuff, { top: -24, left: 45, width: 48, height: 48 }]} />
            </View>

            {/* Cloud 3 */}
            <View style={[styles.cloud, { top: 220, left: 80, width: 80, height: 28, opacity: 0.6 }]}>
              <View style={[styles.cloudPuff, { top: -12, left: 18, width: 30, height: 30 }]} />
            </View>
          </View>
        ))}
      </View>

      {/* Cityscape / Hills silhouette at horizon */}
      <View style={styles.horizonSilhouette}>
        {/* Buildings or hills */}
        <View
          style={[
            styles.building,
            {
              left: 20,
              width: 36,
              height: 55,
              backgroundColor: isNight ? '#1C2541' : '#3AA1A8',
            },
          ]}>
          {isNight && <View style={styles.window} />}
        </View>

        <View
          style={[
            styles.building,
            {
              left: 65,
              width: 44,
              height: 75,
              backgroundColor: isNight ? '#151D33' : '#338F96',
            },
          ]}>
          {isNight && (
            <>
              <View style={[styles.window, { top: 12 }]} />
              <View style={[styles.window, { top: 28 }]} />
            </>
          )}
        </View>

        <View
          style={[
            styles.building,
            {
              left: 120,
              width: 38,
              height: 60,
              backgroundColor: isNight ? '#1C2541' : '#3AA1A8',
            },
          ]}
        />

        <View
          style={[
            styles.building,
            {
              left: 170,
              width: 50,
              height: 85,
              backgroundColor: isNight ? '#131A2E' : '#2D8188',
            },
          ]}>
          {isNight && (
            <>
              <View style={[styles.window, { top: 16 }]} />
              <View style={[styles.window, { top: 36 }]} />
            </>
          )}
        </View>

        <View
          style={[
            styles.building,
            {
              left: 230,
              width: 42,
              height: 65,
              backgroundColor: isNight ? '#1C2541' : '#3AA1A8',
            },
          ]}>
          {isNight && <View style={[styles.window, { top: 20 }]} />}
        </View>

        <View
          style={[
            styles.building,
            {
              left: 285,
              width: 55,
              height: 70,
              backgroundColor: isNight ? '#151D33' : '#338F96',
            },
          ]}
        />
      </View>
    </View>
  );
});

ParallaxSky.displayName = 'ParallaxSky';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: GAME_CONSTANTS.GROUND_HEIGHT,
    overflow: 'hidden',
    zIndex: 1,
  },
  sun: {
    position: 'absolute',
    top: 50,
    right: 40,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FDE047',
    shadowColor: '#FDE047',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
  },
  moon: {
    position: 'absolute',
    top: 50,
    right: 45,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FEF9C3',
    shadowColor: '#FEF9C3',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
  },
  moonCrater1: {
    position: 'absolute',
    top: 10,
    left: 12,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#FDE68A',
  },
  moonCrater2: {
    position: 'absolute',
    bottom: 11,
    right: 13,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FDE68A',
  },
  star: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#FFFFFF',
  },
  cloudsRow: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: GAME_CONSTANTS.CANVAS_WIDTH * 2,
    height: '100%',
  },
  cloudGroup: {
    position: 'absolute',
    top: 0,
    width: GAME_CONSTANTS.CANVAS_WIDTH,
    height: '100%',
  },
  cloud: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 20,
  },
  cloudPuff: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 30,
  },
  horizonSilhouette: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
  },
  building: {
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  window: {
    position: 'absolute',
    top: 10,
    left: 8,
    width: 5,
    height: 5,
    borderRadius: 1,
    backgroundColor: '#FDE047',
    opacity: 0.85,
  },
});
