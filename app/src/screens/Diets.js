import React, { useState, useEffect } from 'react';
import { View, ImageBackground, TouchableOpacity, FlatList, useWindowDimensions, Animated } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context';
import Styles from '../config/Styles';
import Languages from '../languages';
import LanguageContext from '../languages/LanguageContext';
import { getLatestDiets } from "../config/DataApp";
import AppLoading from '../components/InnerLoading';
import { Text, Button, IconButton } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import LoadMoreButton from '../components/LoadMoreButton';
import CollapsibleHeader from '../components/CollapsibleHeader';

export default function Diets(props) {

  const { width, height } = useWindowDimensions();

  const [isLoaded, setIsLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [showButton, setshowButton] = useState(true);
  const [loading, setLoading] = useState(false);
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const contextState = React.useContext(LanguageContext);
  const language = contextState.language;
  const Strings = Languages[language].texts;
  
  const onChangeScreen = (screen) => {
    props.navigation.navigate(screen);
  };

  const onClickItem = (id, title) => {
    props.navigation.navigate('dietdetails', {id, title});
  };

  const loadMore = () => {

    setLoading(true);
    setPage(page+1);

    getLatestDiets(page+1).then((response) => {
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

  const renderDiet = ({item, index}) => (
    <TouchableOpacity key={item.id || index} activeOpacity={0.9} onPress={() => onClickItem(item.id, item.title)}>
      <ImageBackground source={{uri: item.image}} style={[Styles.card3_background, {width: '100%', height: Math.max(180, width * 0.5), marginLeft: 0}]} imageStyle={{borderRadius: 8}}>
        <LinearGradient colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']} style={[Styles.card3_gradient, {height: '100%'}]}>
          <Text numberOfLines={1} style={Styles.card3_category}>{item.category}</Text>
          <Text numberOfLines={2} style={Styles.card3_title}>{item.title}</Text>
          <Text numberOfLines={1} style={[Styles.card3_subtitle, {opacity:0.6}]}>{item.calories} {Strings.ST46} | {Strings.ST62} {item.servings}</Text>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );

  useEffect(() => {
    getLatestDiets().then((response) => {
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
  <CollapsibleHeader title={Strings.ST27} navigation={props.navigation} scrollY={scrollY} showProfile={false} right={<IconButton icon="magnify" mode="contained" containerColor="#f0f0f0" size={24} style={{margin:0}} onPress={() => onChangeScreen('searchdiet')} />} />
  <Animated.FlatList
  style={{width: '100%', height: Math.max(0, height - 56)}}
  data={items}
  renderItem={renderDiet}
  keyExtractor={(item, index) => String(item.id || index)}
  showsHorizontalScrollIndicator={false}
  showsVerticalScrollIndicator={false}
  scrollEnabled={true}
  nestedScrollEnabled={true}
  contentContainerStyle={{padding: 10, paddingTop: 64, paddingBottom: 32}}
  onScroll={Animated.event([{nativeEvent:{contentOffset:{y:scrollY}}}], {useNativeDriver:false})}
  scrollEventThrottle={16}
  ListHeaderComponent={
    <View style={{marginBottom: 15, marginHorizontal: 5}}>
      <View style={{margin: 5}}>
        <Button icon="tag" mode="contained" labelStyle={{fontSize:15, letterSpacing:0}} uppercase={false} style={{elevation: 0}} contentStyle={{width:'100%'}} onPress={() => onChangeScreen('categories')}>
          {Strings.ST28}
        </Button>
    </View>
    </View>
  }
  ListFooterComponent={renderButton}
  />
    </SafeAreaView>

      );

}

}


