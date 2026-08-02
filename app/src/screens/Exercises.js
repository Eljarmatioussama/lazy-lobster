import React, { useState, useEffect } from 'react';
import { FlatList, View, ImageBackground, TouchableOpacity, useWindowDimensions } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context';
import Styles from '../config/Styles';
import Languages from '../languages';
import LanguageContext from '../languages/LanguageContext';
import { getBodyparts } from "../config/DataApp";
import AppLoading from '../components/InnerLoading';
import { Text, Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

export default function Exercises(props) {

  const { height } = useWindowDimensions();
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  const contextState = React.useContext(LanguageContext);
  const language = contextState.language;
  const Strings = Languages[language].texts;
  
  const onChangeScreen = (screen) => {
    props.navigation.navigate(screen);
  };

  const onClickItem = (id, title) => {
    props.navigation.navigate('singlemuscle', {id, title});
  };

  const renderExercise = ({item}) => (
    <TouchableOpacity activeOpacity={0.9} onPress={() => onClickItem(item.id, item.title)} style={{width: '100%', marginBottom: 12}}>
      <ImageBackground source={{uri: item.image}} style={[Styles.card5_background, {width: '100%'}]} imageStyle={{borderRadius: 8}}>
        <LinearGradient colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']} style={Styles.card5_gradient}>
          <Text numberOfLines={1} style={Styles.card5_title}>{item.title}</Text>
          <View style={Styles.card5_border}></View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={{marginBottom: 10, marginHorizontal: 5}}>
      <View style={{margin: 5}}>
        <Button icon="dumbbell" mode="contained" labelStyle={{fontSize:15, letterSpacing:0}} uppercase={false} style={{elevation: 0}} contentStyle={{width:'100%'}} onPress={() => onChangeScreen('equipments')}>
          {Strings.ST57}
        </Button>
      </View>
    </View>
  );

  useEffect(() => {
    getBodyparts().then((response) => {
        setItems(Array.isArray(response) ? response : []);
        setIsLoaded(true);
    });
  }, []);

  if (!isLoaded) {

    return (
   
        <AppLoading/>
   
         );
   
      }else{

 return (

  <SafeAreaView style={{flex: 1}}>
    <FlatList
      style={{width: '100%', height: Math.max(0, height - 56)}}
      data={items}
      renderItem={renderExercise}
      keyExtractor={(item, index) => String(item.id ?? index)}
      ListHeaderComponent={renderHeader}
      contentContainerStyle={{padding: 10, paddingBottom: 32}}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled={true}
    />
  </SafeAreaView>

      );

}

}


