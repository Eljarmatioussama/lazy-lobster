import React from 'react';
import { ScrollView, View, useWindowDimensions } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context';
import Languages from '../languages';
import LanguageContext from '../languages/LanguageContext';
import Heading from '../components/Heading';
import FeaturedPosts from '../components/FeaturedPosts';
import PostTags from '../components/PostTags';
import LatestPosts from '../components/LatestPosts';

export default function Blog(props) {

  const { height } = useWindowDimensions();
  const contextState = React.useContext(LanguageContext);
  const language = contextState.language;
  const Strings = Languages[language].texts;
  
  const onChangeScreen = (screen) => {
    props.navigation.navigate(screen);
  };

  const sections = [
    {key: 'featured', content: <FeaturedPosts/>},
    {key: 'tags', content: <><Heading title={Strings.ST72} button={() => onChangeScreen('tags')}/><PostTags/></>},
    {key: 'latest', content: <><Heading title={Strings.ST73} button={() => onChangeScreen('posts')}/><LatestPosts/></>},
  ];

 return (

  <SafeAreaView style={{flex: 1, minHeight: 0}}>
    <ScrollView
      style={{flex: 1, minHeight: 0, width: '100%', height: Math.max(0, height - 56), overflow: 'scroll'}}
      contentContainerStyle={{paddingBottom: 32}}
      showsVerticalScrollIndicator={false}
      nestedScrollEnabled={true}
    >
      {sections.map((section) => (
        <View key={section.key} style={{width: '100%'}}>{section.content}</View>
      ))}
    </ScrollView>
  </SafeAreaView>

      );

}


