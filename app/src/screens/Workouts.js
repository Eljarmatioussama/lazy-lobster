import React, { useState, useEffect } from 'react';
import { FlatList, View, ImageBackground, TouchableOpacity, useWindowDimensions } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context';
import Styles from '../config/Styles';
import Languages from '../languages';
import LanguageContext from '../languages/LanguageContext';
import { getLatestWorkouts } from "../config/DataApp";
import AppLoading from '../components/InnerLoading';
import { Text, Button, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import LevelRate from '../components/LevelRate';
import LoadMoreButton from '../components/LoadMoreButton';

export default function Workouts(props) {

  const { width, height } = useWindowDimensions();
  const cardWidth = Math.max(0, width - 8);
  const cardHeight = Math.max(180, cardWidth * 0.5);

  const [isLoaded, setIsLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [showButton, setshowButton] = useState(true);
  const [loading, setLoading] = useState(false);

  const contextState = React.useContext(LanguageContext);
  const language = contextState.language;
  const Strings = Languages[language].texts;
  
  const onChangeScreen = (screen) => {
    props.navigation.navigate(screen);
  };

  const onClickItem = (id, title) => {
    props.navigation.navigate('workoutdetails', {id, title});
  };

  const buttonSearch = () => {
    return (
      <IconButton icon="magnify" size={24} style={{marginLeft:15}} onPress={() => onChangeScreen('searchworkout')}/>
      )
  };

  const loadMore = () => {

    setLoading(true);
    setPage(page+1);

    getLatestWorkouts(page+1).then((response) => {
      const nextItems = Array.isArray(response) ? response : [];

      if (!items.length) {
        setItems(nextItems);
        setLoading(false);
      }else{
        setItems([...items, ...nextItems]);
        setLoading(false);
      }

      if (nextItems.length <= 0) {
        setshowButton(false);
      }

      setIsLoaded(true);

    });

  };

  const renderButton = () => {

    return (
      <LoadMoreButton
      Indicator={loading}
      showButton={showButton}
      Items={items}
      Num={5}
      Click={() => loadMore()}/>
      )
  }

  const renderWorkout = ({item}) => (
    <TouchableOpacity activeOpacity={0.9} onPress={() => onClickItem(item.id, item.title)}>
      <ImageBackground source={{uri: item.image}} style={[Styles.card3_background, {width: cardWidth, height: cardHeight, padding: 15, marginBottom: 20}]} imageStyle={{borderRadius: 8}}>
        <LinearGradient colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']} style={[Styles.card3_gradient, {height: cardHeight, position: 'absolute', zIndex: 1}]}>
          <View style={Styles.card3_viewicon}>
            {item.rate ? <LevelRate rate={item.rate}/> : null}
          </View>
          <Text numberOfLines={2} style={Styles.card3_title}>{item.title}</Text>
          <Text numberOfLines={2} style={Styles.card3_subtitle}>{item.duration}</Text>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View style={{flexDirection: 'row', marginBottom: 15, marginHorizontal: 5}}>
      <View style={{flex: 1, margin: 5}}>
        <Button icon="lightning-bolt" mode="contained" labelStyle={{fontSize:15, letterSpacing:0}} uppercase={false} style={{elevation: 0}} contentStyle={{width:'100%'}} onPress={() => onChangeScreen('goals')}>
          {Strings.ST52}
        </Button>
      </View>
      <View style={{flex: 1, margin: 5}}>
        <Button icon="equalizer" mode="contained" labelStyle={{fontSize:15, letterSpacing:0}} uppercase={false} style={{elevation: 0}} contentStyle={{width:'100%'}} onPress={() => onChangeScreen('levels')}>
          {Strings.ST53}
        </Button>
      </View>
    </View>
  );

  useEffect(() => {
  
    props.navigation.setOptions({
        headerRight: () => buttonSearch()
    });
  
  }, []);

  useEffect(() => {
    getLatestWorkouts().then((response) => {
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
      renderItem={renderWorkout}
      keyExtractor={(item, index) => String(item.id ?? index)}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderButton}
      contentContainerStyle={{paddingTop: 10, paddingBottom: 32}}
      scrollEnabled={true}
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}
    />
  </SafeAreaView>

      );

}

}


