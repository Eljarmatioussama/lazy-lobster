import React, { useState, useEffect } from 'react';
import { FlatList, View, ImageBackground, useWindowDimensions } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context';
import Styles from '../config/Styles';
import Languages from '../languages';
import LanguageContext from '../languages/LanguageContext';
import { getLatestProducts } from "../config/DataApp";
import AppLoading from '../components/InnerLoading';
import TouchableScale from 'react-native-touchable-scale';
import { Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import LoadMoreButton from '../components/LoadMoreButton';
import ColorsApp from '../config/ColorsApp';

export default function Products(props) {

  const { height } = useWindowDimensions();

  const [isLoaded, setIsLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [showButton, setshowButton] = useState(true);
  const [loading, setLoading] = useState(false);

  const contextState = React.useContext(LanguageContext);
  const language = contextState.language;
  const Strings = Languages[language].texts;
  
  const onClickItem = (id, title) => {
    props.navigation.navigate('productdetails', {id});
  };

  const loadMore = () => {

    setLoading(true);
    setPage(page+1);

    getLatestProducts(page+1).then((response) => {

      if (!items) {
        setItems(response);
        setLoading(false);
      }else{
        setItems([...items, ...response]);
        setLoading(false);
      }

      if (response.length <= 0) {
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
      Num={6}
      Click={() => loadMore()}/>
      )
  }

  const renderProduct = ({item, index}) => (
    <TouchableScale key={item.id || index} activeOpacity={1} onPress={() => onClickItem(item.id, item.title)} activeScale={0.98} tension={100} friction={10}>
      <ImageBackground source={{uri: item.image}} style={Styles.card3_background} imageStyle={{borderRadius: 8}}>
        <LinearGradient colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']} style={Styles.card3_gradient}>
          <Text numberOfLines={2} style={Styles.card3_title}>{item.title}</Text>
          <Text numberOfLines={1} style={[Styles.card3_subtitle, {color: ColorsApp.PRIMARY, fontWeight:'bold'}]}>{item.price}</Text>
        </LinearGradient>
      </ImageBackground>
    </TouchableScale>
  );

  useEffect(() => {
    getLatestProducts().then((response) => {
        setItems(response);
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
      renderItem={renderProduct}
      keyExtractor={(item, index) => String(item.id || index)}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      scrollEnabled={true}
      nestedScrollEnabled={true}
      contentContainerStyle={{padding: 10, paddingBottom: 32}}
      ListFooterComponent={renderButton}
    />
  </SafeAreaView>

      );

}

}


