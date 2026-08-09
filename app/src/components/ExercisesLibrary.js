import React from 'react';
import { View, I18nManager, TouchableOpacity } from 'react-native';
import { Title, Text, Card } from 'react-native-paper';
import Languages from '../languages';
import LanguageContext from '../languages/LanguageContext';
import { useNavigation } from '@react-navigation/native';
import ColorsApp from '../config/ColorsApp';
import usePreferences from '../hooks/usePreferences';

export default function ExercisesLibrary(){

    const navigation = useNavigation();
    const contextState = React.useContext(LanguageContext);
	const language = contextState.language;
	const Strings = Languages[language].texts;
    const {theme} = usePreferences();
    const dark = theme === 'dark';

    const rightIcon = I18nManager.isRTL ? "chevron-left" : "chevron-right";

    const onChangeScreen = (screen) => {
        navigation.navigate(screen);
    };

	return(
        <TouchableOpacity activeOpacity={0.9} onPress={() => onChangeScreen('exercises')}>
		<View style={{flex: 1, marginHorizontal:18, borderRadius:24, marginBottom:24, backgroundColor:dark ? '#1e1e1e' : '#fff', shadowColor:'#000', shadowOpacity:dark ? 0.3 : 0.14, shadowRadius:18, shadowOffset:{width:0,height:8}, elevation:6}}>
		<Card
        style={{justifyContent: 'center', alignItems: 'flex-start', width:'100%', height:190, borderRadius:24, backgroundColor:dark ? '#1e1e1e' : '#FFFFFF', elevation:0}}>
            <View style={{paddingHorizontal:22, paddingVertical:18, width:'100%'}}>
            <Title style={{fontWeight: 'bold', color:dark ? '#fff' : '#111'}}>{Strings.ST59}</Title>
            <Text style={{marginBottom: 15, color:dark ? '#bbb' : '#111', opacity:0.7}}>{Strings.ST60}</Text>
            <View style={{flexDirection:'row', alignItems:'center', alignContent:'center', justifyContent:'center', backgroundColor:ColorsApp.PRIMARY, paddingVertical:10, paddingHorizontal:12, borderRadius:8}}>
                <Text style={{marginRight:8, color:dark ? '#fff' : '#111', fontWeight:'bold'}}>{Strings.ST61}</Text>
            </View>
            </View>
		</Card>
		</View>
		</TouchableOpacity>
		);
}
