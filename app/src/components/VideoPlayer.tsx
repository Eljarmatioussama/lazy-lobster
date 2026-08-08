import React, {useEffect, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {VideoView, useVideoPlayer} from 'expo-video';
import {useIsFocused} from '@react-navigation/native';

export type VideoPlayerProps = {
  videoUrl: string;
  thumbnail?: string;
  title?: string;
  onVideoCompleted?: () => void;
};

/** Shared native Expo video player. Uses Expo's built-in controls, looping and fullscreen. */
export default function VideoPlayer({videoUrl, onVideoCompleted}: VideoPlayerProps) {
  const viewRef = useRef<any>(null);
  const isFocused = useIsFocused();
  const player = useVideoPlayer(videoUrl, instance => {
    instance.loop = false;
  });

  useEffect(() => {
    try {
      if (isFocused) player.play();
      else player.pause();
    } catch (_) {
      // The native player may already be disposed during navigation.
    }
    return () => {
      try { player.pause(); } catch (_) {}
    };
  }, [isFocused, player]);

  useEffect(() => {
    const completion = player.addListener('playToEnd', () => onVideoCompleted?.());
    return () => completion.remove();
  }, [player, onVideoCompleted]);

  return (
    <View style={styles.card}>
      <VideoView
        ref={viewRef}
        player={player}
        style={styles.video}
        contentFit="contain"
        nativeControls
        fullscreenOptions={{enable: true}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {width: '100%', alignSelf:'stretch', aspectRatio: 16 / 9, marginTop: 24, backgroundColor: '#000', overflow: 'hidden', borderRadius: 0},
  video: {width: '100%', height: '100%', borderRadius: 0},
});
