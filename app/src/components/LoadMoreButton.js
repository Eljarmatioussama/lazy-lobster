import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import Styles from '../config/Styles';
import { Text, ActivityIndicator } from 'react-native-paper';
import Languages from '../languages';
import LanguageContext from '../languages/LanguageContext';
import { size } from "lodash";
import ColorsApp from '../config/ColorsApp';
import usePreferences from '../hooks/usePreferences';

export default function LoadMoreButton(props){
	
  const contextState = React.useContext(LanguageContext);
  const language = contextState.language;
  const Strings = Languages[language].texts;

	const {Indicator, showButton, Items, Click, Num } = props;
	const {theme} = usePreferences();
	const dark = theme === 'dark';

    if (size(Items) >= Num) {

  if (showButton) {
    return (
      <View style={{height: 100, alignItems:'center', justifyContent:'center'}}>
        <TouchableOpacity activeOpacity={0.85} style={{minWidth:190, height:52, paddingHorizontal:24, borderRadius:26, backgroundColor:ColorsApp.PRIMARY, flexDirection:'row', alignItems:'center', justifyContent:'center', elevation:4, shadowColor:'#102a43', shadowOpacity:0.18, shadowRadius:8, shadowOffset:{width:0,height:4}}} onPress={Click}>
        {!Indicator ? <Text style={{color:'#fff', fontWeight:'700', fontSize:15}}>{Strings.ST111}</Text> : <ActivityIndicator animating={Indicator} size={22} color="#fff" />}
        </TouchableOpacity>
      </View>
    )
}else{
  return (
    <View style={{height:70, alignItems:'center', justifyContent:'center'}}>
      <View style={{height:1, width:'35%', backgroundColor:dark ? '#444' : '#d9e2e5', marginBottom:10}} />
      <Text style={{opacity: 0.45, color:dark ? '#fff' : '#222', fontSize:13}}>{Strings.ST112}</Text>
    </View>
  )

}
}else{
  return null
}

}

