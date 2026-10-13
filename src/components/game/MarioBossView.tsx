import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { BossState } from '@/types/game';
import { GAME_CONSTANTS } from '@/constants/gameConfig';

interface MarioBossViewProps {
  boss: BossState;
}

export const MarioBossView: React.FC<MarioBossViewProps> = React.memo(({ boss }) => {
  if (boss.phase === 'none') return null;

  const isAttacking = boss.laserActiveTimer > 0 || boss.currentAttack !== null;
  const isCharging = boss.laserWarningTimer > 0;

  return (
    <View
      style={[
        styles.container,
        {
          left: boss.x,
          top: boss.y,
          opacity: boss.phase === 'warning' ? 0.75 : 1,
        },
      ]}>
      {/* Menacing Aura when charging or attacking */}
      {(isCharging || isAttacking) && (
        <View
          style={[
            styles.aura,
            {
              backgroundColor: isCharging
                ? 'rgba(239, 68, 68, 0.35)'
                : 'rgba(245, 158, 11, 0.4)',
            },
          ]}
        />
      )}

      {/* Mario Red Cap */}
      <View style={styles.capCrown}>
        {/* Emblem White Circle with Red 'M' */}
        <View style={styles.emblemCircle}>
          <Text style={styles.emblemText}>M</Text>
        </View>
      </View>
      <View style={styles.capVisor} />

      {/* Mario Head / Face */}
      <View style={styles.face}>
        {/* Hair sideburns */}
        <View style={styles.hairLeft} />

        {/* Eyes with angry brows */}
        <View style={styles.eyeRow}>
          <View style={styles.eye}>
            <View style={styles.pupil} />
            {isCharging && <View style={styles.eyeLaserGlint} />}
          </View>
          <View style={styles.eye}>
            <View style={styles.pupil} />
            {isCharging && <View style={styles.eyeLaserGlint} />}
          </View>
        </View>

        {/* Big Mario Round Nose */}
        <View style={styles.nose} />

        {/* Iconic Bushy Mustache */}
        <View style={styles.mustache}>
          <View style={styles.mustacheBump1} />
          <View style={styles.mustacheBump2} />
          <View style={styles.mustacheBump3} />
        </View>

        {/* Open Roaring Mouth when attacking */}
        {isAttacking && (
          <View style={styles.roaringMouth}>
            <View style={styles.tongue} />
          </View>
        )}
      </View>

      {/* Mario Body */}
      <View style={styles.body}>
        {/* Red Shirt */}
        <View style={styles.redShirt} />

        {/* Blue Overalls */}
        <View style={styles.overalls}>
          {/* Yellow Overall Buttons */}
          <View style={[styles.overallButton, { left: 16 }]} />
          <View style={[styles.overallButton, { right: 16 }]} />
        </View>

        {/* White Gloved Hands */}
        <View style={[styles.hand, styles.handLeft]}>
          {isCharging && <View style={styles.laserHandGlow} />}
        </View>
        <View style={[styles.hand, styles.handRight]}>
          {boss.currentAttack === 'mushroom' && (
            <Text style={styles.heldItem}>🍄</Text>
          )}
          {boss.currentAttack === 'fireball' && (
            <Text style={styles.heldItem}>🔥</Text>
          )}
        </View>
      </View>
    </View>
  );
});

MarioBossView.displayName = 'MarioBossView';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: GAME_CONSTANTS.BOSS_WIDTH,
    height: GAME_CONSTANTS.BOSS_HEIGHT,
    zIndex: 25,
    alignItems: 'center',
  },
  aura: {
    position: 'absolute',
    top: -12,
    left: -12,
    right: -12,
    bottom: -12,
    borderRadius: 50,
  },
  capCrown: {
    width: 68,
    height: 28,
    backgroundColor: '#DC2626',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderWidth: 2.5,
    borderColor: '#7F1D1D',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 6,
  },
  emblemCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#7F1D1D',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -2,
  },
  emblemText: {
    fontSize: 12,
    fontWeight: '900',
    color: '#DC2626',
    lineHeight: 14,
  },
  capVisor: {
    width: 76,
    height: 10,
    backgroundColor: '#B91C1C',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#7F1D1D',
    marginTop: -4,
    zIndex: 7,
  },
  face: {
    width: 62,
    height: 40,
    backgroundColor: '#FED7AA',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#78350F',
    alignItems: 'center',
    marginTop: -4,
    position: 'relative',
    zIndex: 5,
  },
  hairLeft: {
    position: 'absolute',
    left: -5,
    top: 6,
    width: 10,
    height: 18,
    backgroundColor: '#451A03',
    borderRadius: 5,
  },
  eyeRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 5,
  },
  eye: {
    width: 10,
    height: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  pupil: {
    width: 5,
    height: 7,
    backgroundColor: '#0284C7',
    borderRadius: 2.5,
  },
  eyeLaserGlint: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#EF4444',
  },
  nose: {
    position: 'absolute',
    top: 14,
    width: 20,
    height: 16,
    borderRadius: 10,
    backgroundColor: '#FDBA74',
    borderWidth: 2,
    borderColor: '#78350F',
    zIndex: 10,
  },
  mustache: {
    position: 'absolute',
    top: 24,
    flexDirection: 'row',
    zIndex: 9,
  },
  mustacheBump1: {
    width: 16,
    height: 12,
    backgroundColor: '#271206',
    borderRadius: 6,
  },
  mustacheBump2: {
    width: 18,
    height: 14,
    backgroundColor: '#271206',
    borderRadius: 7,
    marginTop: -2,
    marginHorizontal: -4,
  },
  mustacheBump3: {
    width: 16,
    height: 12,
    backgroundColor: '#271206',
    borderRadius: 6,
  },
  roaringMouth: {
    position: 'absolute',
    bottom: 2,
    width: 18,
    height: 10,
    backgroundColor: '#7F1D1D',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    alignItems: 'center',
    overflow: 'hidden',
  },
  tongue: {
    position: 'absolute',
    bottom: 0,
    width: 10,
    height: 6,
    backgroundColor: '#F87171',
    borderRadius: 4,
  },
  body: {
    width: 74,
    height: 42,
    marginTop: -4,
    alignItems: 'center',
    position: 'relative',
    zIndex: 4,
  },
  redShirt: {
    position: 'absolute',
    top: 0,
    width: '100%',
    height: 24,
    backgroundColor: '#DC2626',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#7F1D1D',
  },
  overalls: {
    position: 'absolute',
    top: 10,
    width: 58,
    height: 32,
    backgroundColor: '#1D4ED8',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#1E3A8A',
  },
  overallButton: {
    position: 'absolute',
    top: 4,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#FDE047',
    borderWidth: 1,
    borderColor: '#854D0E',
  },
  hand: {
    position: 'absolute',
    width: 22,
    height: 22,
    backgroundColor: '#FFFFFF',
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#334155',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 8,
  },
  handLeft: {
    left: -8,
    top: 14,
  },
  handRight: {
    right: -8,
    top: 14,
  },
  laserHandGlow: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444',
  },
  heldItem: {
    fontSize: 16,
  },
});
