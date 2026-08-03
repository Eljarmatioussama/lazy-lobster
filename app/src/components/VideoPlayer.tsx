import React, {useEffect, useRef} from 'react';
import {StyleSheet, View} from 'react-native';
import {VideoView, useVideoPlayer} from 'expo-video';

export type VideoPlayerProps = {
  videoUrl: string;
  thumbnail?: string;
  title?: string;
  onVideoCompleted?: () => void;
};

/** Shared native Expo video player. Uses Expo's built-in controls, looping and fullscreen. */
export default function VideoPlayer({videoUrl, onVideoCompleted}: VideoPlayerProps) {
  const viewRef = useRef<any>(null);
  const player = useVideoPlayer(videoUrl, instance => {
    instance.loop = true;
    instance.play();
  });

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
  card: {width: '100%', aspectRatio: 16 / 9, marginTop: 24, marginHorizontal:0, backgroundColor: '#000', overflow: 'hidden', borderRadius: 0},
  video: {width: '100%', height: '100%'},
});
