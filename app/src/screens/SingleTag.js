import React, { useState, useEffect } from 'react';
import { ScrollView, View, ImageBackground, TouchableOpacity, useWindowDimensions } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context';
import Styles from '../config/Styles';
import Languages from '../languages';
import LanguageContext from '../languages/LanguageContext';
import { getPostsByTag } from "../config/DataApp";
import AppLoading from '../components/InnerLoading';
import { Paragraph, Text } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import LoadMoreButton from '../components/LoadMoreButton';
import ColorsApp from '../config/ColorsApp';
import moment from 'moment';
import NoContentFound from '../components/NoContentFound';

export default function SingleTag(props) {

  const { width, height } = useWindowDimensions();
  const cardHeight = Math.max(180, (width - 20) * 0.5);
    const contextState = React.useContext(LanguageContext);
    const language = contextState.language;
    const Strings = Languages[language].texts;

  const { route } = props;
  const { navigation } = props;
  const { id, title } = route.params;
  const [page, setPage] = useState(1);
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState([]);
  const [showButton, setshowButton] = useState(true);
  const [loading, setLoading] = useState(false);

  const onClickItem = (id, title) => {
    navigation.navigate('postdetails', {id, title});
  };

useEffect(() => {

  props.navigation.setOptions({
    title:title,
  });

}, []);

  useEffect(() => {

    getPostsByTag(id).then(response => {
        setData(response);
        setIsLoaded(true);
    })

  }, []);

  const loadMore = () => {

    setLoading(true);
    setPage(page+1);

    getPostsByTag(id, page+1).then((response) => {

      if (!data) {
        setData(response);
        setLoading(false);
      }else{
        setData([...data, ...response]);
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
      Items={data}
      Num={10}
      Click={() => loadMore()}/>
      )
  }

  const renderPost = ({item}) => (
    <TouchableOpacity activeOpacity={0.9} onPress={() => onClickItem(item.id, item.title)}>
      <ImageBackground source={{uri: item.image}} style={[Styles.card3_background, {width: '100%', height: cardHeight}]} imageStyle={{borderRadius: 8}}>
        <LinearGradient colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.7)']} style={[Styles.card3_gradient, {height: cardHeight}]}>
          <View style={[Styles.card3_viewicon, {paddingLeft:5, paddingVertical:6}]}>
            <Text style={[Styles.card3_icon, {paddingLeft:0}]}>{item.tag}</Text>
          </View>

          <Paragraph style={Styles.card1_subtitle}>{item.level}</Paragraph>
          <Text numberOfLines={2} style={Styles.card1_title}>{item.title}</Text>
          <Text numberOfLines={1} style={[Styles.card1_title, {color: ColorsApp.PRIMARY, marginVertical:5}]}>{moment(item.date).fromNow()}</Text>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );

  if (isLoaded) {

   return (
    <SafeAreaView style={{flex: 1, minHeight: 0}}>
    <ScrollView
      style={{flex: 1, minHeight: 0, width: '100%', height: Math.max(0, height - 56), overflow: 'scroll'}}
      contentContainerStyle={{paddingVertical: 10, paddingHorizontal: 10, paddingBottom: 50}}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      scrollEnabled={true}
      nestedScrollEnabled={true}
    >
      {data.map((item, index) => (
        <View key={String(item.id ?? index)}>
          {renderPost({item})}
        </View>
      ))}
      {renderButton()}
      <NoContentFound data={data}/>
    </ScrollView>
    </SafeAreaView>

    );

 }else{
   return (
     <AppLoading/>
     );
 }

}


