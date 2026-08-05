import React from 'react';
import {Animated, Text, View} from 'react-native';
import {IconButton} from 'react-native-paper';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default function CollapsibleHeader({title, navigation, scrollY, right, left}) {
  const insets = useSafeAreaInsets();
  const translateY = scrollY.interpolate({inputRange:[0,70], outputRange:[0,-70], extrapolate:'clamp'});
  const opacity = scrollY.interpolate({inputRange:[0,45,70], outputRange:[1,0.4,0], extrapolate:'clamp'});
  const headerHeight = scrollY.interpolate({inputRange:[0,70], outputRange:[68 + insets.top, insets.top], extrapolate:'clamp'});
  return <Animated.View style={{height:headerHeight, paddingTop:insets.top, position:'absolute', top:0, left:0, right:0, zIndex:10, overflow:'hidden', backgroundColor:'#fff'}}><Animated.View style={{height:56, transform:[{translateY}], opacity, flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:8, paddingBottom:10}}><View style={{flexDirection:'row',alignItems:'center'}}>{left}{title ? <Text style={{fontSize:20,fontWeight:'700'}}>{title}</Text> : null}</View><View style={{flexDirection:'row',alignItems:'center'}}>{right}{!left && <IconButton icon="account-circle-outline" size={27} style={{marginVertical:0}} onPress={() => navigation.navigate('profile')} />}</View></Animated.View><View pointerEvents="none" style={{position:'absolute',top:0,left:0,right:0,height:insets.top,backgroundColor:'#fff',zIndex:20}} /></Animated.View>;
}
