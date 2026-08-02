import React, { useState, useEffect } from 'react';
import { FlatList, View, Image, I18nManager, TouchableOpacity } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context';
import Languages from '../languages';
import LanguageContext from '../languages/LanguageContext';
import { getLatestPosts } from "../config/DataApp";
import AppLoading from '../components/InnerLoading';
import { Text } from 'react-native-paper';
import LoadMoreButton from '../components/LoadMoreButton';
import moment from 'moment';

export default function Posts(props) {

  const [isLoaded, setIsLoaded] = useState(false);
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [showButton, setshowButton] = useState(true);
  const [loading, setLoading] = useState(false);

  const contextState = React.useContext(LanguageContext);
  const language = contextState.language;
  const Strings = Languages[language].texts;

  const rightIcon = I18nManager.isRTL ? "chevron-left" : "chevron-right";
  
  const onClickItem = (id, title) => {
    props.navigation.navigate('postdetails', {id, title});
  };

  const loadMore = () => {

    setLoading(true);
    setPage(page+1);

    getLatestPosts(page+1).then((response) => {

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
      <View style={{marginTop:20}}>
      <LoadMoreButton
      Indicator={loading}
      showButton={showButton}
      Items={items}
      Num={6}
      Click={() => loadMore()}/>
      </View>
      )
  }

  const renderPost = ({item}) => (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onClickItem(item.id, item.title)}
      style={{flexDirection: 'row', alignItems: 'center', minHeight: 90, paddingVertical: 10}}
    >
      <Image source={{uri: item.image}} style={{width: 70, height: 70, borderRadius: 8, marginRight: 12}} />
      <View style={{flex: 1}}>
        <Text numberOfLines={2} style={{fontWeight: 'bold', fontSize: 15, marginBottom: 4}}>{item.title}</Text>
        <Text style={{opacity: 0.6, fontSize: 13}}>{moment(item.date).fromNow()}</Text>
      </View>
      <Text style={{fontSize: 26, opacity: 0.35, marginHorizontal: 8}}>{rightIcon === 'chevron-left' ? '‹' : '›'}</Text>
    </TouchableOpacity>
  );

  useEffect(() => {
    getLatestPosts(1).then((response) => {
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
      style={{flex: 1, width: '100%'}}
      data={items}
      renderItem={renderPost}
      keyExtractor={(item, index) => String(item.id ?? index)}
      ListFooterComponent={renderButton}
      contentContainerStyle={{paddingHorizontal: 10, paddingBottom: 32}}
      showsVerticalScrollIndicator={false}
      scrollEnabled={true}
      nestedScrollEnabled={true}
      onEndReached={() => {
        if (!loading && showButton) loadMore();
      }}
      onEndReachedThreshold={0.5}
    />
  </SafeAreaView>

      );

}

}


