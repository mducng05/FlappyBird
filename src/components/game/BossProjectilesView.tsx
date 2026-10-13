import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { BossState } from '@/types/game';
import { GAME_CONSTANTS } from '@/constants/gameConfig';

interface BossProjectilesViewProps {
  boss: BossState;
}

export const BossProjectilesView: React.FC<BossProjectilesViewProps> = ({ boss }) => {
  return (
    <View style={styles.container} pointerEvents="none">
      {/* 1. Laser Warning Guide Beam (Flashing line across screen) */}
      {boss.laserWarningTimer > 0 && boss.laserActiveTimer === 0 && (
        <View
          style={[
            styles.laserWarningZone,
            {
              top: boss.laserY,
              height: boss.laserHeight,
              width: GAME_CONSTANTS.CANVAS_WIDTH,
            },
          ]}>
          <View style={styles.laserWarningLine} />
          <View style={styles.laserWarningBadge}>
            <Text style={styles.laserWarningText}>⚡ NÉ LAZE! ⚡</Text>
          </View>
        </View>
      )}

      {/* 2. Active Giant Mega Laser Beam */}
      {boss.laserActiveTimer > 0 && (
        <View
          style={[
            styles.activeLaserContainer,
            {
              top: boss.laserY,
              height: boss.laserHeight,
              width: GAME_CONSTANTS.CANVAS_WIDTH,
            },
          ]}>
          <View style={styles.laserOuter} />
          <View style={styles.laserCore} />
          <View style={styles.laserInnerWhite} />
          <View style={styles.laserSparks}>
            <Text style={styles.laserSparksText}>⚡⚡⚡⚡⚡⚡⚡⚡</Text>
          </View>
        </View>
      )}

      {/* 3. Boss Projectiles (Mushrooms, Shells & Fireballs) */}
      {boss.projectiles.map((proj) => (
        <View
          key={proj.id}
          style={[
            styles.projectileWrapper,
            {
              left: proj.x,
              top: proj.y,
              width: proj.size,
              height: proj.size,
              transform: [{ rotate: `${proj.angle}deg` }],
            },
          ]}>
          {proj.type === 'mushroom' ? (
            /* Super Mario Red Mushroom */
            <View style={styles.mushroom}>
              <View style={styles.mushroomCap}>
                <View style={styles.mushroomDotCenter} />
                <View style={styles.mushroomDotLeft} />
                <View style={styles.mushroomDotRight} />
              </View>
              <View style={styles.mushroomStem}>
                <View style={styles.mushroomEye1} />
                <View style={styles.mushroomEye2} />
              </View>
            </View>
          ) : proj.type === 'shell' ? (
            /* Green Koopa Shell */
            <View style={styles.koopaShell}>
              <View style={styles.shellRim} />
              <View style={styles.shellPattern} />
            </View>
          ) : (
            /* Flaming Fireball */
            <View style={styles.fireball}>
              <View style={styles.fireballOuter} />
              <View style={styles.fireballMid} />
              <View style={styles.fireballCore} />
            </View>
          )}
        </View>
      ))}

      {/* 4. Player Golden Eggs / Stars */}
      {boss.playerEggs.map((egg) => (
        <View
          key={egg.id}
          style={[
            styles.playerEgg,
            {
              left: egg.x,
              top: egg.y,
            },
          ]}>
          <View style={styles.eggInner} />
        </View>
      ))}
    </View>
  );
};

BossProjectilesView.displayName = 'BossProjectilesView';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 35,
  },
  laserWarningZone: {
    position: 'absolute',
    left: 0,
    backgroundColor: 'rgba(239, 68, 68, 0.22)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#EF4444',
  },
  laserWarningLine: {
    width: '100%',
    height: 3,
    backgroundColor: '#FEF08A',
  },
  laserWarningBadge: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#FEF08A',
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  laserWarningText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
    fontFamily: 'monospace',
    letterSpacing: 1,
  },
  activeLaserContainer: {
    position: 'absolute',
    left: 0,
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 8,
  },
  laserOuter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#EF4444',
  },
  laserCore: {
    position: 'absolute',
    top: 6,
    left: 0,
    right: 0,
    bottom: 6,
    backgroundColor: '#38BDF8',
  },
  laserInnerWhite: {
    position: 'absolute',
    top: 13,
    left: 0,
    right: 0,
    bottom: 13,
    backgroundColor: '#FFFFFF',
  },
  laserSparks: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  laserSparksText: {
    color: '#FEF08A',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 8,
  },
  projectileWrapper: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  /* Super Mario Mushroom */
  mushroom: {
    width: 34,
    height: 34,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 2,
    elevation: 4,
  },
  mushroomCap: {
    width: 34,
    height: 22,
    backgroundColor: '#EF4444',
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    borderWidth: 2,
    borderColor: '#7F1D1D',
    position: 'relative',
    overflow: 'hidden',
  },
  mushroomDotCenter: {
    position: 'absolute',
    top: 3,
    left: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  mushroomDotLeft: {
    position: 'absolute',
    top: 7,
    left: 1,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  mushroomDotRight: {
    position: 'absolute',
    top: 7,
    right: 1,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  mushroomStem: {
    width: 20,
    height: 12,
    backgroundColor: '#FED7AA',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    borderWidth: 2,
    borderColor: '#78350F',
    marginTop: -2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  mushroomEye1: {
    width: 2,
    height: 5,
    backgroundColor: '#000',
    borderRadius: 1,
  },
  mushroomEye2: {
    width: 2,
    height: 5,
    backgroundColor: '#000',
    borderRadius: 1,
  },
  /* Green Koopa Shell */
  koopaShell: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#22C55E',
    borderWidth: 2.5,
    borderColor: '#14532D',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 2,
  },
  shellRim: {
    width: 26,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#14532D',
  },
  shellPattern: {
    position: 'absolute',
    width: 14,
    height: 14,
    backgroundColor: '#16A34A',
    borderRadius: 3,
    transform: [{ rotate: '45deg' }],
  },
  /* Fireball */
  fireball: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#F97316',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  fireballOuter: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#EF4444',
  },
  fireballMid: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F97316',
  },
  fireballCore: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FEF08A',
  },
  /* Player Egg */
  playerEgg: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FDE047',
    borderWidth: 2,
    borderColor: '#B45309',
    zIndex: 36,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FDE047',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 4,
  },
  eggInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
});
