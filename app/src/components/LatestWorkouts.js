import React, { useState, useEffect } from 'react';
import { ScrollView, View, ImageBackground, TouchableOpacity, useWindowDimensions } from 'react-native';
import Styles from '../config/Styles';
import Loading from './InnerLoading';
import { getLatestWorkouts } from "../config/DataApp";
import { Paragraph, Text} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import LevelRate from './LevelRate';

export default function LatestWorkouts() {

  const { width } = useWindowDimensions();
  const cardWidth = width * 0.7;
  const cardHeight = Math.max(180, cardWidth * 0.65);

  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  const navigation = useNavigation();

  const onChangeScreen = (id, title) => {
    navigation.navigate('workoutdetails', {id, title});
  };

  useEffect(() => {
    getLatestWorkouts().then((response) => {
        setItems(Array.isArray(response) ? response : []);
        setIsLoaded(true);
    });
  }, []);


  if (!isLoaded) {
    return (
      <Loading/>
      );
  }

  if (isLoaded) {
    return (
      <ScrollView
          style={{width: '100%'}}
          contentContainerStyle={{paddingHorizontal: 10, paddingRight: 20}}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
        {items.map((item, index) => (
    
    <View key={item.id || index} style={{width: cardWidth, marginRight: 12}}>
    <TouchableOpacity activeOpacity={0.9} onPress={() => onChangeScreen(item.id, item.title)}>
        <ImageBackground source={{uri: item.image}} style={[Styles.card1_background, {width: '100%', height: cardHeight, marginLeft: 0, marginBottom: 0}]} imageStyle={{borderRadius: 8}}>
          <LinearGradient colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']} style={[Styles.card1_gradient, {height: cardHeight}]}>

            {/*item.price === "premium" ? <View style={Styles.card1_viewicon}><Icon name="lock" style={Styles.card1_icon}/></View> : null */}
            
            {item.rate ? <View style={[Styles.card1_viewicon, {flexDirection:'row'}]}><LevelRate rate={item.rate}/></View> : null}

            <Paragraph style={Styles.card1_subtitle}>{item.level}</Paragraph>
            <Text numberOfLines={2} style={Styles.card1_title}>{item.title}</Text>

          </LinearGradient>
        </ImageBackground>
        </TouchableOpacity>
    </View>

          ))}
      </ScrollView>
      );
  }

}
