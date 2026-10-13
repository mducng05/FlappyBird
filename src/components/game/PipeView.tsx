import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PipePair } from '@/types/game';
import { GAME_CONSTANTS } from '@/constants/gameConfig';

interface PipeViewProps {
  pipe: PipePair;
  gap: number;
}

export const PipeView: React.FC<PipeViewProps> = React.memo(({ pipe, gap }) => {
  const { PIPE_WIDTH, PIPE_CAP_HEIGHT, PIPE_CAP_EXTRA_WIDTH } = GAME_CONSTANTS;
  const bottomPipeTop = pipe.topHeight + gap;

  return (
    <View style={[styles.container, { left: pipe.x, width: PIPE_WIDTH }]}>
      {/* Top Pipe Body */}
      <View
        style={[
          styles.pipeBody,
          {
            top: 0,
            height: Math.max(0, pipe.topHeight - PIPE_CAP_HEIGHT),
            width: PIPE_WIDTH,
          },
        ]}>
        {/* Highlight strip */}
        <View style={styles.pipeHighlight} />
        {/* Secondary highlight */}
        <View style={styles.pipeSubHighlight} />
        {/* Shadow strip */}
        <View style={styles.pipeShadow} />
      </View>

      {/* Top Pipe Cap (at bottom of top pipe) */}
      <View
        style={[
          styles.pipeCap,
          {
            top: Math.max(0, pipe.topHeight - PIPE_CAP_HEIGHT),
            height: PIPE_CAP_HEIGHT,
            width: PIPE_WIDTH + PIPE_CAP_EXTRA_WIDTH,
            left: -PIPE_CAP_EXTRA_WIDTH / 2,
          },
        ]}>
        <View style={styles.pipeHighlight} />
        <View style={styles.pipeSubHighlight} />
        <View style={styles.pipeShadow} />
      </View>

      {/* Bottom Pipe Cap (at top of bottom pipe) */}
      <View
        style={[
          styles.pipeCap,
          {
            top: bottomPipeTop,
            height: PIPE_CAP_HEIGHT,
            width: PIPE_WIDTH + PIPE_CAP_EXTRA_WIDTH,
            left: -PIPE_CAP_EXTRA_WIDTH / 2,
          },
        ]}>
        <View style={styles.pipeHighlight} />
        <View style={styles.pipeSubHighlight} />
        <View style={styles.pipeShadow} />
      </View>

      {/* Bottom Pipe Body */}
      <View
        style={[
          styles.pipeBody,
          {
            top: bottomPipeTop + PIPE_CAP_HEIGHT,
            height: Math.max(0, pipe.bottomHeight - PIPE_CAP_HEIGHT),
            width: PIPE_WIDTH,
          },
        ]}>
        <View style={styles.pipeHighlight} />
        <View style={styles.pipeSubHighlight} />
        <View style={styles.pipeShadow} />
      </View>
    </View>
  );
});

PipeView.displayName = 'PipeView';

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    zIndex: 10,
  },
  pipeBody: {
    position: 'absolute',
    backgroundColor: '#73BF2E',
    borderWidth: 2.5,
    borderColor: '#234E17',
    overflow: 'hidden',
  },
  pipeCap: {
    position: 'absolute',
    backgroundColor: '#73BF2E',
    borderWidth: 2.5,
    borderColor: '#234E17',
    borderRadius: 3,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  pipeHighlight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 4,
    width: 6,
    backgroundColor: '#9DE64E',
    opacity: 0.9,
  },
  pipeSubHighlight: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 14,
    width: 3,
    backgroundColor: '#86DA3B',
    opacity: 0.5,
  },
  pipeShadow: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 3,
    width: 9,
    backgroundColor: '#4B881E',
  },
});
