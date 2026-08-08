import React, { useState, useEffect, useRef } from 'react';
import { View, ImageBackground, ScrollView, Animated } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context';
import Styles from '../config/Styles';
import Languages from '../languages';
import LanguageContext from '../languages/LanguageContext';
import { getWorkoutById, removeWorkoutBookmark, setWorkoutBookmark } from "../config/DataApp";
import AppLoading from '../components/InnerLoading';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, IconButton } from 'react-native-paper';
import VideoPlayer from '../components/VideoPlayer';
import { Col, Grid } from 'react-native-easy-grid';
import Days from '../components/Days';
import LevelRate from '../components/LevelRate';
import AsyncStorage from '@react-native-async-storage/async-storage';
import usePreferences from '../hooks/usePreferences';
import CollapsibleHeader from '../components/CollapsibleHeader';

export default function WorkoutDetails(props) {

  const { route } = props;
  const { navigation } = props;
  const { id, title } = route.params;

  const [isLoaded, setIsLoaded] = useState(false);
  const [isBookmark, setBookmark] = useState('');
  const [item, setItem] = useState([]);

  const contextState = React.useContext(LanguageContext);
  const language = contextState.language;
  const Strings = Languages[language].texts;
  const {theme} = usePreferences();
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const renderBookMark = async (id) => {
    await AsyncStorage.getItem('workoutsFav').then(token => {
      const res = JSON.parse(token);
 
      if (res !== null) {
       let data = res.find(value => value.id === id);
 
       if (data !== null) {
         let data = res.find(value => value.id === id);
         return data == null ? setBookmark(false) : setBookmark(true);
       }
 
     } else {
       return false;
     }
 
   });
  };

  useEffect(() => {
    renderBookMark(id);
  }, []);

  const saveBookmark = (id, title, image) => {

    let data = {id, title, image};
    setBookmark(true);
    setWorkoutBookmark(data).then(token => {
      if (token === true) {
        setBookmark(true);
      }
    });
    
  };
  
  const removeBookmark = (id) => {
    removeWorkoutBookmark(id).then(token => {
     if (token === true) {
       setBookmark(false);
     }
     
   });
   
   };

  const renderButtonFav = () => {

    if (!isBookmark) {
        return (
          <IconButton icon="heart-outline" mode="contained" containerColor={theme === 'dark' ? '#292929' : '#f0f0f0'} iconColor={theme === 'dark' ? '#fff' : '#111'} size={24} style={{marginRight: 8, marginVertical:0}} onPress={() => saveBookmark(item.id, item.title, item.image)}/>
          )
      }else{
        return (
          <IconButton icon="heart" mode="contained" containerColor={theme === 'dark' ? '#292929' : '#f0f0f0'} iconColor="red" size={24} style={{marginRight: 8, marginVertical:0}} onPress={() => removeBookmark(item.id)}/>
          )
        }
      }

      useEffect(() => {

        props.navigation.setOptions({headerShown: false});

      }, [isBookmark, item]);

  useEffect(() => {
    getWorkoutById(id).then((response) => {
        setItem(response[0]);
        setIsLoaded(true);
    });
  }, []);

  if (!isLoaded) {

    return (
   
        <View style={{marginTop:50}}>
          <AppLoading/>
          </View>
   
         );
   
  }else{

 const introVideo = item.introVideo || item.intro_video || item.workout_intro_video;

 return (

  <><CollapsibleHeader title="" navigation={navigation} scrollY={scrollY} left={<IconButton icon="chevron-left" mode="contained" containerColor={theme === 'dark' ? '#292929' : '#f0f0f0'} iconColor={theme === 'dark' ? '#fff' : '#111'} size={24} style={{marginVertical:0}} onPress={() => navigation.goBack()} />} right={renderButtonFav()} /><Animated.ScrollView
  style={{flex: 1}}
  contentContainerStyle={{paddingTop: 32, paddingBottom: 32}}
  showsHorizontalScrollIndicator={false}
  showsVerticalScrollIndicator={false}
  onScroll={Animated.event([{nativeEvent:{contentOffset:{y:scrollY}}}], {useNativeDriver:false})}
  scrollEventThrottle={16}
>
    
<SafeAreaView>

    <View style={{paddingTop: 24, backgroundColor: theme === 'dark' ? '#121212' : '#fff'}}>

    {introVideo ? <VideoPlayer videoUrl={introVideo} thumbnail={item.image} title={item.title} onVideoCompleted={() => {}} /> : <ImageBackground source={{uri: item.image}} style={Styles.HeaderImage} resizeMode={'cover'}>
    <LinearGradient colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.4)']} style={Styles.HeaderGradient}>

    <Text style={Styles.HeaderTitle}>{item.title}</Text>
    <Text style={Styles.HeaderSubTitle}>{item.duration}</Text>

    <View style={{flexDirection:'row', marginTop:8}}>
    <LevelRate rate={item.rate} iconsize={22}></LevelRate>
    </View>

    </LinearGradient>
    </ImageBackground>}

    <Grid style={Styles.WorkoutGrid}>

      <Col style={Styles.WorkoutGridCol}>
      <Text style={Styles.WorkoutGridTitle}>{Strings.ST87}</Text>
      <Text style={[Styles.WorkoutGridSubTitle, theme === 'dark' && {color:'#e7f5ef'}]}>{item.level}</Text>
      </Col>

      <Col style={Styles.WorkoutGridCol}>
      <Text style={Styles.WorkoutGridTitle}>{Strings.ST89}</Text>
      <Text style={[Styles.WorkoutGridSubTitle, theme === 'dark' && {color:'#e7f5ef'}]}>{item.goal}</Text>
      </Col>

    </Grid>

    <Days Number={7} WorkoutId={item.id}></Days>

    </View>
    </SafeAreaView>
    </Animated.ScrollView></>

      );

}

}


