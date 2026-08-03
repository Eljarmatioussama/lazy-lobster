import React, {useEffect, useRef, useState} from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text, View, Platform} from 'react-native';
import {VideoView, useVideoPlayer} from 'expo-video';
import Slider from '@react-native-community/slider';
import Animated, {useAnimatedStyle, useSharedValue, withTiming} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import * as ScreenOrientation from 'expo-screen-orientation';

export type VideoPlayerProps = {videoUrl: string; thumbnail?: string; title?: string; onVideoCompleted?: () => void};

const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
const fmt = (v: number) => `${Math.floor(v / 60)}:${String(Math.floor(v % 60)).padStart(2, '0')}`;

export default function VideoPlayer({videoUrl, thumbnail, title, onVideoCompleted}: VideoPlayerProps) {
  const player = useVideoPlayer(videoUrl, p => { p.loop = false; });
  const [playing, setPlaying] = useState(false), [ready, setReady] = useState(false), [buffering, setBuffering] = useState(true);
  const [current, setCurrent] = useState(0), [duration, setDuration] = useState(0), [speed, setSpeed] = useState(1), [done, setDone] = useState(false), [error, setError] = useState('');
  const [controls, setControls] = useState(true), hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const webVideo = useRef<any>(null);
  const rootView = useRef<any>(null);
  const opacity = useSharedValue(1);
  const showControls = () => { setControls(true); opacity.value = withTiming(1); if (hideTimer.current) clearTimeout(hideTimer.current); hideTimer.current = setTimeout(() => { setControls(false); opacity.value = withTiming(0); }, 3000); };
  const overlay = useAnimatedStyle(() => ({opacity: opacity.value}));
  useEffect(() => { if (Platform.OS !== 'web') return; const onChange = async () => { try { if (document.fullscreenElement) await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE); else await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT_UP); } catch (_) {} }; document.addEventListener('fullscreenchange', onChange); return () => document.removeEventListener('fullscreenchange', onChange); }, []);
  useEffect(() => { showControls(); const a = player.addListener('timeUpdate', e => {setCurrent(e.currentTime); setDuration(player.duration || 0);}); const b = player.addListener('statusChange', e => {setReady(e.status === 'readyToPlay'); setBuffering(e.status === 'loading'); if (e.error) setError(e.error.message);}); const c = player.addListener('playToEnd', () => {setDone(true); setPlaying(false); onVideoCompleted?.();}); return () => {a.remove(); b.remove(); c.remove(); if (hideTimer.current) clearTimeout(hideTimer.current);}; }, [player]);
  const toggle = () => { const target: any = Platform.OS === 'web' ? webVideo.current : player; if (done) { if (Platform.OS === 'web') { target.currentTime = 0; target.play(); } else player.replay(); setDone(false); setPlaying(true); } else { if (playing) target.pause(); else target.play(); setPlaying(!playing); } showControls(); };
  const seek = (v: number) => {if (Platform.OS === 'web' && webVideo.current) webVideo.current.currentTime = v; else player.currentTime = v; setCurrent(v);};
  const tap = Gesture.Tap().numberOfTaps(1).onEnd(() => showControls());
  const left = Gesture.Tap().numberOfTaps(2).onEnd(() => {player.currentTime = Math.max(0, player.currentTime - 10); showControls();});
  const right = Gesture.Tap().numberOfTaps(2).onEnd(() => {player.currentTime = Math.min(player.duration || 0, player.currentTime + 10); showControls();});
  const fullscreen = async () => { try { if (Platform.OS === 'web') { const node = rootView.current; if (document.fullscreenElement) await document.exitFullscreen(); else if (node?.requestFullscreen) await node.requestFullscreen(); return; } await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE); } catch (_) { /* Fullscreen/orientation can be unavailable in embedded browsers. */ } };
  return <View ref={rootView} style={styles.container}>
    {Platform.OS !== 'web' && !ready && thumbnail ? <Animated.Image source={{uri: thumbnail}} resizeMode="contain" style={styles.thumbnail} /> : null}
    {Platform.OS === 'web' ? React.createElement('video', {ref: webVideo, src: videoUrl, autoPlay: true, muted: true, playsInline: true, onLoadedMetadata: (e: any) => setDuration(e.currentTarget.duration || 0), onTimeUpdate: (e: any) => {setCurrent(e.currentTarget.currentTime || 0); setDuration(e.currentTarget.duration || 0);}, onPlay: () => setPlaying(true), onPause: () => setPlaying(false), onEnded: () => {setDone(true); setPlaying(false); onVideoCompleted?.();}, style: {width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#000'}}) : <VideoView player={player} style={styles.video} contentFit="contain" nativeControls={false} />}
    <GestureDetector gesture={Gesture.Simultaneous(tap, left, right)}><View style={StyleSheet.absoluteFill} /></GestureDetector>
    {Platform.OS !== 'web' && buffering && !done ? <ActivityIndicator color="#fff" size="large" style={StyleSheet.absoluteFill} /> : null}
    {error ? <Text style={styles.error}>{error}</Text> : null}
    <Animated.View pointerEvents={controls ? 'auto' : 'none'} style={[StyleSheet.absoluteFill, styles.overlay, overlay]}>
      <Pressable style={styles.center} onPress={toggle}><Text style={styles.play}>{done ? '↻' : playing ? '❚❚' : '▶'}</Text></Pressable>
      <View style={styles.bottom}><Text style={styles.time}>{fmt(current)} / {fmt(duration)}</Text><Slider value={current} minimumValue={0} maximumValue={duration || 1} onValueChange={seek} minimumTrackTintColor="#16df92" maximumTrackTintColor="#aaa" thumbTintColor="#fff" style={styles.slider}/><View style={styles.row}><Pressable onPress={fullscreen}><Text style={styles.control}>⛶</Text></Pressable><View style={styles.speeds}>{speeds.map(s => <Pressable key={s} onPress={() => {if (Platform.OS === 'web' && webVideo.current) webVideo.current.playbackRate = s; else player.playbackRate = s; setSpeed(s);}}><Text style={[styles.speed, speed === s && styles.active]}>{s}x</Text></Pressable>)}</View></View></View>
    </Animated.View>
  </View>;
}
const styles = StyleSheet.create({container:{height:260,backgroundColor:'#000',borderRadius:16,overflow:'hidden'},video:{...StyleSheet.absoluteFillObject},thumbnail:{...StyleSheet.absoluteFillObject,width:'100%',height:'100%'},overlay:{backgroundColor:'transparent'},center:{flex:1,alignItems:'center',justifyContent:'center'},play:{color:'#fff',fontSize:34,textShadow:'0px 2px 8px #000'},bottom:{position:'absolute',bottom:0,left:0,right:0,paddingHorizontal:10,paddingVertical:6,backgroundColor:'rgba(0,0,0,.62)'},time:{color:'#fff',fontSize:11},slider:{height:24,padding:0},row:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},control:{color:'#fff',fontSize:21},speeds:{flexDirection:'row',gap:7},speed:{color:'#ddd',fontSize:11},active:{color:'#16df92',fontWeight:'700'},error:{color:'#fff',position:'absolute',alignSelf:'center',top:'45%',padding:10}}
);
