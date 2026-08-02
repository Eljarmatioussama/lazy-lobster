import React, { useState, useEffect } from 'react';
import { ScrollView, View, ImageBackground, TouchableOpacity, useWindowDimensions } from 'react-native';
import Styles from '../config/Styles';
import Loading from './InnerLoading';
import { getLatestDiets } from "../config/DataApp";
import { Text} from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Languages from '../languages';
import LanguageContext from '../languages/LanguageContext';
import { useNavigation } from '@react-navigation/native';

export default function LatestWorkouts(props) {

  const { width } = useWindowDimensions();
  const cardWidth = width * 0.7;
  const cardHeight = Math.max(130, cardWidth * 0.75);

  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  const contextState = React.useContext(LanguageContext);
  const language = contextState.language;
  const Strings = Languages[language].texts;

  const navigation = useNavigation();
  
  const onChangeScreen = (id, title) => {
    navigation.navigate('dietdetails', {id, title});
  };

  useEffect(() => {
    getLatestDiets(1, 6).then((response) => {
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
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: 10, paddingRight: 20}}
      >
        {items.map((item, index) => (
          <View key={item.id || index} style={{width: cardWidth, marginRight: 12}}>
            <TouchableOpacity activeOpacity={0.9} onPress={() => onChangeScreen(item.id, item.title)}>
              <ImageBackground source={{uri: item.image}} style={[Styles.card4_background, {height: cardHeight}]} imageStyle={{borderRadius: 8}}>
                <LinearGradient colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']} style={[Styles.card4_gradient, {height: cardHeight}]}>
  
              <View style={Styles.card4_viewicon}>
                  <Text style={{fontSize:12, color: '#fff', opacity:0.8}}>{item.calories} {Strings.ST46}</Text>
              </View>
              <Text numberOfLines={1} style={Styles.card4_title}>{item.title}</Text>
  
                </LinearGradient>
              </ImageBackground>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      );
  }

}
