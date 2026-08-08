import React, { useState, useEffect, useRef } from 'react';
import { View, ImageBackground, ScrollView, useWindowDimensions, Animated  } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context';
import Styles from '../config/Styles';
import Languages from '../languages';
import LanguageContext from '../languages/LanguageContext';
import { getDietById, removeDietBookmark, setDietBookmark } from "../config/DataApp";
import AppLoading from '../components/InnerLoading';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, IconButton, Card } from 'react-native-paper';
import { Col, Grid } from 'react-native-easy-grid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HTMLStyles } from '../config/HTMLStyles';
import { HTMLStylesDark } from '../config/HTMLStylesDark';
import HTMLView from 'react-native-render-html';
import usePreferences from '../hooks/usePreferences';
import CollapsibleHeader from '../components/CollapsibleHeader';
import {Svg, Circle, Path} from 'react-native-svg';

const MacroChart = ({item, dark}) => {
  const base = [
    {label:'Protein', value:parseFloat(item.protein) || 0, color:'#10e689', unit:'g'},
    {label:'Fat', value:parseFloat(item.fat) || 0, color:'#ffb020', unit:'g'},
    {label:'Carbs', value:parseFloat(item.carbs) || 0, color:'#4d9fff', unit:'g'},
  ];
  const extras = Array.isArray(item.attributes) ? item.attributes.map(attribute => ({label:attribute.label, value:parseFloat(attribute.value) || 0, color:attribute.color || '#9b59b6', unit:''})) : [];
  const attributes = [...base, ...extras];
  const values = attributes.map(attribute => attribute.value);
  const total = values.reduce((sum, value) => sum + value, 0) || 1;
  const radius = 62;
  const innerRadius = 38;
  let offset = 0;
  const point = (angle, size) => [85 + size * Math.cos(angle), 85 + size * Math.sin(angle)];
  return <View style={{alignItems:'center', paddingVertical:18, backgroundColor:dark ? '#121212' : '#fff'}}>
    <Svg width={170} height={170} viewBox="0 0 170 170">
      <Circle cx="85" cy="85" r={radius} stroke={dark ? '#292929' : '#e8eeee'} strokeWidth="24" fill="none" />
      {values.map((value, index) => {
        const start = -Math.PI / 2 + (offset / total) * Math.PI * 2;
        const end = start + (value / total) * Math.PI * 2;
        const [x1, y1] = point(start, radius);
        const [x2, y2] = point(end, radius);
        const [ix1, iy1] = point(start, innerRadius);
        const [ix2, iy2] = point(end, innerRadius);
        const largeArc = end - start > Math.PI ? 1 : 0;
        offset += value;
        return <Path key={index} d={`M${x1} ${y1} A${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L${ix2} ${iy2} A${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1} Z`} fill={attributes[index].color} />;
      })}
    </Svg>
    <View style={{position:'absolute', top:18, width:170, height:170, alignItems:'center', justifyContent:'center'}}><Text style={{fontSize:22, fontWeight:'bold', color:dark ? '#fff' : '#111'}}>{item.calories}</Text><Text style={{color:dark ? '#bbb' : '#666'}}>Calories</Text></View>
    <View style={{flexDirection:'row', justifyContent:'space-around', width:'100%', marginTop:8}}>
      {attributes.map(attribute => <View key={attribute.label} style={{alignItems:'center', minWidth:'28%', marginHorizontal:4}}><View style={{width:10,height:10,borderRadius:5,backgroundColor:attribute.color,marginBottom:4}}/><Text style={{color:dark ? '#fff' : '#111', fontWeight:'bold'}}>{String(attribute.value).replace(/g$/i, '')}{attribute.unit}</Text><Text style={{color:dark ? '#bbb' : '#666'}}>{attribute.label}</Text></View>)}
    </View>
  </View>;
};

export default function DietDetails(props) {

  const { width } = useWindowDimensions();
  const { route } = props;
  const { navigation } = props;
  const { id, title } = route.params;

  const {theme} = usePreferences();
  const scrollY = React.useRef(new Animated.Value(0)).current;
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBookmark, setBookmark] = useState('');
  const [item, setItem] = useState([]);

  const contextState = React.useContext(LanguageContext);
  const language = contextState.language;
  const Strings = Languages[language].texts;

  const renderBookMark = async (id) => {
    await AsyncStorage.getItem('dietsFav').then(token => {
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
    setDietBookmark(data).then(token => {
      if (token === true) {
        setBookmark(true);
      }
    });
    
  };
  
  const removeBookmark = (id) => {
    removeDietBookmark(id).then(token => {
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
    getDietById(id).then((response) => {
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

    <ImageBackground source={{uri: item.image}} style={Styles.Header2Image} resizeMode={'cover'}>
    <LinearGradient colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.4)']} style={Styles.Header2Gradient}>

    <Text style={Styles.Header2Category}>{item.category}</Text>
    <Text style={Styles.Header2Title}>{item.title}</Text>
    <Text style={Styles.Header2SubTitle}>{Strings.ST93+' '+item.servings+' | '+Strings.ST94+' '+item.time}</Text>

    </LinearGradient>
    </ImageBackground>

    <MacroChart item={item} dark={theme === 'dark'} />

    <View style={{marginTop:15, marginHorizontal:15}}>
        <Card style={{marginBottom:15, borderWidth:0}} mode={'outlined'}>
            <Card.Title title={Strings.ST114} />
            <Card.Content>
            <HTMLView source={{html: item.description ? item.description : `<p></p>`}} contentWidth={width} tagsStyles={theme === "light" ? HTMLStyles : HTMLStylesDark}/>
            </Card.Content>
        </Card>

        <Card style={{marginBottom:15, borderWidth:0}} mode={'outlined'}>
            <Card.Title title={Strings.ST115} />
            <Card.Content>
            <HTMLView source={{html: item.ingredients ? item.ingredients : `<p></p>`}} contentWidth={width} tagsStyles={theme === "light" ? HTMLStyles : HTMLStylesDark}/>
            </Card.Content>
        </Card>

        <Card style={{marginBottom:15, borderWidth:0}} mode={'outlined'}>
            <Card.Title title={Strings.ST116} />
            <Card.Content>
            <HTMLView source={{html: item.instructions ? item.instructions : `<p></p>`}} contentWidth={width} tagsStyles={theme === "light" ? HTMLStyles : HTMLStylesDark}/>
            </Card.Content>
        </Card>

    </View>

    </View>
    </SafeAreaView>
    </Animated.ScrollView></>

      );

}

}


