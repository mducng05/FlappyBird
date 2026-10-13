import React from 'react';
import {
  View,
  StyleSheet,
  Pressable,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { useFlappyGame } from '@/hooks/useFlappyGame';
import { GAME_CONSTANTS, DIFFICULTY_CONFIG } from '@/constants/gameConfig';
import { ParallaxSky } from './ParallaxSky';
import { GroundView } from './GroundView';
import { PipeView } from './PipeView';
import { BirdView } from './BirdView';
import { MarioBossView } from './MarioBossView';
import { BossProjectilesView } from './BossProjectilesView';
import { BossHUD } from './BossHUD';
import { ScoreHUD } from './ScoreHUD';
import { GetReadyView } from './GetReadyView';
import { GameOverModal } from './GameOverModal';
import { PauseModal } from './PauseModal';
import { SkinModal } from './SkinModal';
import { StatsModal } from './StatsModal';
import { SettingsModal } from './SettingsModal';

export const GameBoard: React.FC = () => {
  const {
    status,
    bird,
    pipes,
    score,
    highScore,
    groundOffset,
    cloudOffset,
    isNewHighScore,
    screenFlash,
    selectedSkin,
    settings,
    stats,
    boss,
    showSkinModal,
    showStatsModal,
    showSettingsModal,
    flap,
    shootEgg,
    startBossBattle,
    restartGame,
    togglePause,
    changeSkin,
    updateSettings,
    setShowSkinModal,
    setShowStatsModal,
    setShowSettingsModal,
  } = useFlappyGame();

  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  // Calculate responsive scaling for canvas
  const canvasWidth = GAME_CONSTANTS.CANVAS_WIDTH;
  const canvasHeight = GAME_CONSTANTS.CANVAS_HEIGHT;

  // On mobile screens, fit nicely or stretch height
  const scale = Math.min(
    windowWidth / canvasWidth,
    windowHeight / canvasHeight,
    Platform.OS === 'web' && windowWidth > 600 ? 1.15 : 1.05
  );

  const diff = DIFFICULTY_CONFIG[settings.difficulty];

  return (
    <View style={styles.outerContainer}>
      {/* Game Cabinet Container with fixed aspect ratio */}
      <View
        style={[
          styles.canvasFrame,
          {
            width: canvasWidth * scale,
            height: canvasHeight * scale,
          },
        ]}>
        {/* Inner Scaled Viewport */}
        <View
          style={[
            styles.viewport,
            {
              width: canvasWidth,
              height: canvasHeight,
              transform: [{ scale }],
              transformOrigin: 'top left',
            },
          ]}>
          {/* Main Tap Handler covering entire playable area */}
          <Pressable
            style={styles.tapArea}
            onPress={flap}
            android_disableSound>
            {/* Parallax Sky Background */}
            <ParallaxSky offset={cloudOffset} theme={settings.theme} />

            {/* Pipes */}
            {pipes.map((pipe) => (
              <PipeView key={pipe.id} pipe={pipe} gap={diff.gap} />
            ))}

            {/* Giant Mario Boss */}
            <MarioBossView boss={boss} />

            {/* Boss Projectiles (Lasers, Mushrooms, Fireballs, Eggs) */}
            <BossProjectilesView boss={boss} />

            {/* Bird Player */}
            <BirdView bird={bird} skin={selectedSkin} />

            {/* Scrolling Ground */}
            <GroundView offset={groundOffset} />

            {/* Screen Flash on Collision */}
            {screenFlash && <View style={styles.flashOverlay} pointerEvents="none" />}

            {/* Score HUD during gameplay */}
            {status === 'playing' && (
              <ScoreHUD
                score={score}
                onPause={togglePause}
                isPaused={false}
              />
            )}

            {/* Boss HP Bar, Warning & Weapon Shoot Button */}
            {status === 'playing' && (
              <BossHUD boss={boss} onShootEgg={shootEgg} />
            )}

            {/* Get Ready View when Idle */}
            {status === 'idle' && (
              <GetReadyView
                highScore={highScore}
                currentSkin={selectedSkin}
                onOpenSkins={() => setShowSkinModal(true)}
                onOpenStats={() => setShowStatsModal(true)}
                onOpenSettings={() => setShowSettingsModal(true)}
                onStartBossBattle={startBossBattle}
              />
            )}

            {/* Game Over Modal */}
            {status === 'gameover' && (
              <GameOverModal
                score={score}
                highScore={highScore}
                isNewHighScore={isNewHighScore}
                onRestart={restartGame}
                onOpenSkins={() => setShowSkinModal(true)}
                onOpenStats={() => setShowStatsModal(true)}
              />
            )}

            {/* Pause Modal */}
            <PauseModal
              visible={status === 'paused'}
              soundEnabled={settings.soundEnabled}
              onResume={togglePause}
              onRestart={restartGame}
              onToggleSound={() =>
                updateSettings({
                  ...settings,
                  soundEnabled: !settings.soundEnabled,
                })
              }
            />

            {/* Skins Customization Modal */}
            <SkinModal
              visible={showSkinModal}
              highScore={highScore}
              currentSkin={selectedSkin}
              onSelectSkin={changeSkin}
              onClose={() => setShowSkinModal(false)}
            />

            {/* Stats Modal */}
            <StatsModal
              visible={showStatsModal}
              stats={stats}
              onClose={() => setShowStatsModal(false)}
            />

            {/* Settings Modal */}
            <SettingsModal
              visible={showSettingsModal}
              settings={settings}
              onUpdateSettings={updateSettings}
              onClose={() => setShowSettingsModal(false)}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  canvasFrame: {
    overflow: 'hidden',
    backgroundColor: '#4EC0CA',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 12,
    borderWidth: Platform.OS === 'web' ? 4 : 0,
    borderColor: '#334155',
    borderRadius: Platform.OS === 'web' ? 24 : 0,
  },
  viewport: {
    position: 'relative',
    overflow: 'hidden',
  },
  tapArea: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  flashOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    zIndex: 80,
  },
});
