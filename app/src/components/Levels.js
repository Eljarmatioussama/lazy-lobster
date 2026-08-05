import React, { useState, useEffect } from 'react';
import { ScrollView, View, ImageBackground, TouchableOpacity, useWindowDimensions} from 'react-native';
import Styles from '../config/Styles';
import {map} from 'lodash';
import Loading from './InnerLoading';
import {getLevels} from "../config/DataApp";
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export default function Levels() {

  const { width } = useWindowDimensions();
  const cardWidth = Math.max(130, width * 0.35);
  const cardHeight = Math.max(96, cardWidth * 0.8);

  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);


  useEffect(() => {
    getLevels().then((response) => {
        setItems(response);
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
      <View style={{marginVertical: 10, marginBottom:30}}>
      <ScrollView
          style={{width: '100%'}}
          contentContainerStyle={{ flexGrow: 1, paddingRight: 20 }}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
        {map(items, (item, index) => (
        <RenderItem key={index} item={item} cardWidth={cardWidth} cardHeight={cardHeight} />

          ))}
      </ScrollView>
      </View>
      );
  }

}

function RenderItem(props) {

    const navigation = useNavigation();

    const onChangeScreen = (id, title) => {
    navigation.navigate('singlelevel', {
      id: id,
      title: title
    });    
  };

    const { item, cardWidth, cardHeight } = props;
    const { id, title } = item;

      return (
          
    <View style={[Styles.card6_view, {width: cardWidth}]}>
      <TouchableOpacity onPress={() => onChangeScreen(id, title)} activeOpacity={0.9}>
        <ImageBackground source={{uri: item.image}} style={[Styles.card6_background, {width: cardWidth, height: cardHeight}]} imageStyle={{borderRadius: 8}}>
          <LinearGradient colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']} style={[Styles.card6_gradient, {width: cardWidth, height: cardHeight}]}>
            <Text style={Styles.card6_title} numberOfLines={2}>{item.title}</Text>
          </LinearGradient>
        </ImageBackground>
      </TouchableOpacity>
    </View>

      )

}
