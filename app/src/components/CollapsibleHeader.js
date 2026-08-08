import React from 'react';
import {Animated, Text, View, Image, Pressable} from 'react-native';
import {IconButton} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {auth} from '../config/ConfigFirebase';
import ConfigApp from '../config/ConfigApp';
import usePreferences from '../hooks/usePreferences';
export default function CollapsibleHeader({title,navigation,scrollY,right,left,showProfile=true}) {
 const insets=useSafeAreaInsets();
 const {theme}=usePreferences();
 const dark=theme==='dark';
 const photo=auth.currentUser?.photoURL?auth.currentUser.photoURL.replace('http://localhost:8080',ConfigApp.URL.replace(/\/$/,'')):null;
 const translateY=scrollY.interpolate({inputRange:[0,70],outputRange:[0,-70],extrapolate:'clamp'});
 const opacity=scrollY.interpolate({inputRange:[0,45,70],outputRange:[1,0.4,0],extrapolate:'clamp'});
 const headerHeight=scrollY.interpolate({inputRange:[0,70],outputRange:[68+insets.top,insets.top],extrapolate:'clamp'});
 const circle={width:42,height:42,borderRadius:21,alignItems:'center',justifyContent:'center',backgroundColor:dark?'#292929':'#f0f0f0',borderWidth:1,borderColor:dark?'#555':'#c8c8c8'};
 return <Animated.View style={{height:headerHeight,paddingTop:insets.top,position:'absolute',top:0,left:0,right:0,zIndex:10,overflow:'hidden',backgroundColor:dark?'#121212':'#fff'}}><Animated.View style={{height:56,transform:[{translateY}],opacity,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:8,paddingBottom:10}}><View style={{flexDirection:'row',alignItems:'center'}}>{left}{title?<Text style={{fontSize:20,fontWeight:'700',color:dark?'#fff':'#111'}}>{title}</Text>:null}</View><View style={{flexDirection:'row',alignItems:'center'}}>{right}{showProfile&&!left&&<Pressable onPress={()=>navigation.navigate('profile')} style={circle}>{photo?<Image source={{uri:photo}} style={{width:42,height:42,borderRadius:21}}/>:<IconButton icon="account-circle-outline" iconColor={dark?'#fff':'#111'} size={27} style={{margin:0}}/>}</Pressable>}</View></Animated.View><View pointerEvents="none" style={{position:'absolute',top:0,left:0,right:0,height:insets.top,backgroundColor:dark?'#121212':'#fff',zIndex:20}}/></Animated.View>;
}
