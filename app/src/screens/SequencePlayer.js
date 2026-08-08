import React, {useEffect, useMemo, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, IconButton} from 'react-native-paper';
import {getExerciseProgress, saveExerciseProgress} from '../config/DataApp';
import {VideoView, useVideoPlayer} from 'expo-video';
import ConfigApp from '../config/ConfigApp';
import ColorsApp from '../config/ColorsApp';

const mediaUrl = (value) => {
  if (!value) return null;
  const url = String(value).trim();
  if (/^https?:\/\//i.test(url)) {
    return url.replace('http://localhost:8080', ConfigApp.URL.replace(/\/$/, ''));
  }
  return `${ConfigApp.URL}${url.replace(/^\/+/, '')}`;
};

export default function SequencePlayer({route, navigation}) {
  const items = Array.isArray(route.params?.orderedItems) ? route.params.orderedItems : [];
  const [index, setIndex] = useState(0);
  const [showNextPrompt, setShowNextPrompt] = useState(false);
  const [savedProgress, setSavedProgress] = useState(0);
  const item = items[index] || {};
  const videoUrl = useMemo(() => mediaUrl(item.video), [item.video]);
  const player = useVideoPlayer(videoUrl, instance => {
    instance.loop = false;
    if (videoUrl) instance.play();
  });

  useEffect(() => {
    getExerciseProgress(item.id).then(setSavedProgress);
  }, [item.id]);

  useEffect(() => {
    if (savedProgress > 0 && player.duration > 0) {
      player.currentTime = player.duration * savedProgress / 100;
    }
  }, [player, savedProgress, videoUrl]);

  const next = () => {
    setShowNextPrompt(false);
    setIndex(value => Math.min(value + 1, items.length - 1));
  };
  const previous = () => setIndex(value => Math.max(value - 1, 0));

  useEffect(() => {
    setShowNextPrompt(false);
    const subscription = player.addListener('playToEnd', () => {
      if (index < items.length - 1) next();
    });
    const progress = player.addListener('timeUpdate', ({currentTime}) => {
      const duration = player.duration;
      if (duration > 0 && item.id) {
        const percent = Math.min(100, Math.round((currentTime / duration) * 100));
        saveExerciseProgress(item.id, percent);
      }
      if (index < items.length - 1 && duration > 0 && duration - currentTime <= 10) {
        setShowNextPrompt(true);
      }
    });
    return () => {
      subscription.remove();
      progress.remove();
      if (player.duration > 0 && item.id) {
        saveExerciseProgress(item.id, Math.min(100, Math.round((player.currentTime / player.duration) * 100)));
      }
    };
  }, [player, index, items.length, item.id]);

  if (!items.length) return <View style={styles.empty}><Text>No exercises found.</Text></View>;

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.top}>
          <IconButton icon="close" iconColor="#111" onPress={() => navigation.goBack()} />
          <Text style={styles.counter}>{index + 1} / {items.length}</Text>
          <View style={{width: 48}} />
        </View>
        <Text style={styles.title}>{item.title || 'Exercise'}</Text>
        <View style={styles.videoBox}>
          {videoUrl ? <VideoView player={player} style={styles.video} contentFit="contain" nativeControls fullscreenOptions={{enable: false}} />
            : item.image ? <Image source={{uri: mediaUrl(item.image)}} style={styles.video} resizeMode="cover" />
            : <Text style={styles.noVideo}>No video available</Text>}
          {showNextPrompt && <View style={styles.nextPrompt}>
            <Text style={styles.nextLabel}>Up next: {items[index + 1]?.title || 'Next exercise'}</Text>
            <Button mode="contained" buttonColor={ColorsApp.PRIMARY} onPress={next}>Next exercise</Button>
          </View>}
        </View>
        <View style={styles.controls}>
          <Button mode="text" textColor="#fff" disabled={index === 0} onPress={previous}>Previous</Button>
          <Button mode="contained" buttonColor={ColorsApp.PRIMARY} onPress={next} disabled={index === items.length - 1}>
            {index === items.length - 1 ? 'Finished' : 'Next exercise'}
          </Button>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {flex: 1, backgroundColor: '#fff'},
  safe: {flex: 1},
  top: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  counter: {color: '#111', fontWeight: '700'},
  title: {color: '#111', fontSize: 24, fontWeight: '700', marginHorizontal: 20, marginVertical: 18},
  videoBox: {width: '100%', aspectRatio: 16 / 9, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center'},
  video: {width: '100%', height: '100%'},
  noVideo: {color: '#111'},
  nextPrompt: {position: 'absolute', right: 12, bottom: 12, padding: 12, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.82)', maxWidth: '85%'},
  nextLabel: {color: '#fff', fontWeight: '700', marginBottom: 6},
  controls: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20},
  empty: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
