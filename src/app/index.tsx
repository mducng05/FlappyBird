import React from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { GameBoard } from '@/components/game/GameBoard';

export default function FlappyBirdGameScreen() {
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <GameBoard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
});
