import React, {useEffect, useMemo, useState} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, IconButton} from 'react-native-paper';
import {getExerciseProgress, saveExerciseProgress} from '../config/DataApp';
import {VideoView, useVideoPlayer} from 'expo-video';
import ConfigApp from '../config/ConfigApp';
import ColorsApp from '../config/ColorsApp';
import usePreferences from '../hooks/usePreferences';

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
  const {theme} = usePreferences();
  const dark = theme === 'dark';
  const [index, setIndex] = useState(0);
  const [showNextPrompt, setShowNextPrompt] = useState(false);
  const [savedProgress, setSavedProgress] = useState(0);
  const item = items[index] || {};
  const level = item.level_title || item.level;
  const goal = item.goal_title || item.goal;
  const videoUrl = useMemo(() => mediaUrl(item.video), [item.video]);
  const player = useVideoPlayer(videoUrl, instance => {
    instance.loop = false;
    if (videoUrl) instance.play();
  });

  useEffect(() => {
    getExerciseProgress(item.id).then(setSavedProgress);
  }, [item.id]);

  useEffect(() => {
    if (savedProgress <= 0) return;
    let attempts = 0;
    const seekToSavedPosition = setInterval(() => {
      attempts += 1;
      try {
        if (player.duration > 0) {
          player.currentTime = player.duration * savedProgress / 100;
          clearInterval(seekToSavedPosition);
        } else if (attempts >= 20) {
          clearInterval(seekToSavedPosition);
        }
      } catch (_) {
        clearInterval(seekToSavedPosition);
      }
    }, 500);
    return () => clearInterval(seekToSavedPosition);
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
      try {
        const duration = player.duration;
        if (duration > 0 && item.id) {
          const percent = Math.min(100, Math.round((currentTime / duration) * 100));
          saveExerciseProgress(item.id, percent);
        }
        if (index < items.length - 1 && duration > 0 && duration - currentTime <= 10) setShowNextPrompt(true);
      } catch (_) {}
    });
    const saver = setInterval(() => {
      try {
        const duration = player.duration;
        if (duration > 0 && item.id) {
          saveExerciseProgress(item.id, Math.min(100, Math.round((player.currentTime / duration) * 100)));
        }
      } catch (_) {}
    }, 1000);
    return () => {
      subscription.remove();
      progress.remove();
      clearInterval(saver);
      try {
        if (player.duration > 0 && item.id) saveExerciseProgress(item.id, Math.min(100, Math.round((player.currentTime / player.duration) * 100)));
      } catch (_) {}
    };
  }, [player, index, items.length, item.id]);

  if (!items.length) return <View style={styles.empty}><Text>No exercises found.</Text></View>;

  return (
    <View style={[styles.root, {backgroundColor: dark ? '#121212' : '#fff'}]}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.top}>
          <IconButton icon="close" mode="contained" containerColor={dark ? '#292929' : '#eef2f5'} iconColor={dark ? '#fff' : '#111'} onPress={() => navigation.goBack()} />
          <View style={[styles.counterPill, {backgroundColor: dark ? '#292929' : '#eef2f5'}]}>
            <Text style={[styles.counter, {color: dark ? '#fff' : '#111'}]}>CLASS {index + 1} OF {items.length}</Text>
          </View>
          <View style={{width: 48}} />
        </View>
        <View style={styles.heading}>
          <Text style={styles.eyebrow}>NOW PLAYING</Text>
          <Text style={[styles.title, {color: dark ? '#fff' : '#111'}]}>{item.title || 'Exercise'}</Text>
          {(level || goal) && <View style={styles.metaRow}>
            {level && <View style={[styles.metaPill, {backgroundColor: dark ? '#292929' : '#eef2f5'}]}><Text style={[styles.metaText, {color: dark ? '#ddd' : '#4b5b66'}]}>{level}</Text></View>}
            {goal && <View style={[styles.metaPill, {backgroundColor: dark ? '#292929' : '#eef2f5'}]}><Text style={[styles.metaText, {color: dark ? '#ddd' : '#4b5b66'}]}>{goal}</Text></View>}
          </View>}
        </View>
        <View style={styles.videoBox}>
          {videoUrl ? <VideoView player={player} style={styles.video} contentFit="contain" nativeControls fullscreenOptions={{enable: false}} />
            : item.image ? <Image source={{uri: mediaUrl(item.image)}} style={styles.video} resizeMode="cover" />
            : <Text style={[styles.noVideo, {color: dark ? '#fff' : '#111'}]}>No video available</Text>}
          {showNextPrompt && <View style={styles.nextPrompt}>
            <Text style={styles.nextLabel}>Up next: {items[index + 1]?.title || 'Next exercise'}</Text>
            <Button mode="contained" buttonColor={ColorsApp.PRIMARY} onPress={next}>Next exercise</Button>
          </View>}
        </View>
        <View style={styles.dots}>
          {items.map((_, dotIndex) => <View key={dotIndex} style={[styles.dot, {backgroundColor: dotIndex === index ? ColorsApp.PRIMARY : (dark ? '#444' : '#d7e0e5'), width: dotIndex === index ? 22 : 7}]} />)}
        </View>
        {items[index + 1] && <View style={[styles.upNextCard, {backgroundColor: dark ? '#1e1e1e' : '#f4f7f8'}]}>
          <View style={styles.upNextCopy}>
            <Text style={[styles.upNextEyebrow, {color: dark ? '#aaa' : '#71808a'}]}>UP NEXT</Text>
            <Text style={[styles.upNextTitle, {color: dark ? '#fff' : '#18232b'}]} numberOfLines={1}>{items[index + 1].title}</Text>
          </View>
        </View>}
        <View style={styles.controls}>
          <Button mode="text" textColor={dark ? '#fff' : '#111'} disabled={index === 0} onPress={previous}>Previous</Button>
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
  top: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingTop: 4},
  counterPill: {paddingHorizontal: 13, paddingVertical: 8, borderRadius: 20},
  counter: {fontSize: 11, letterSpacing: 0.7, fontWeight: '800'},
  heading: {paddingHorizontal: 20, paddingTop: 8, paddingBottom: 16},
  eyebrow: {color: ColorsApp.PRIMARY, fontSize: 11, fontWeight: '800', letterSpacing: 1.2, marginBottom: 6},
  title: {color: '#111', fontSize: 25, fontWeight: '800'},
  metaRow: {flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 11},
  metaPill: {paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14},
  metaText: {fontSize: 12, fontWeight: '600'},
  videoBox: {width: '100%', aspectRatio: 16 / 9, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center'},
  video: {width: '100%', height: '100%'},
  noVideo: {color: '#111'},
  nextPrompt: {position: 'absolute', right: 12, bottom: 12, padding: 12, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.82)', maxWidth: '85%'},
  nextLabel: {color: '#fff', fontWeight: '700', marginBottom: 6},
  dots: {flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 5, paddingVertical: 14},
  dot: {height: 7, borderRadius: 4},
  upNextCard: {marginHorizontal: 20, padding: 12, borderRadius: 14, flexDirection: 'row', alignItems: 'center'},
  upNextCopy: {flex: 1, marginRight: 10},
  upNextEyebrow: {fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 3},
  upNextTitle: {fontSize: 15, fontWeight: '700'},
  controls: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, paddingTop: 14},
  empty: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});
