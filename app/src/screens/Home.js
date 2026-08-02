import React from 'react';
import { FlatList, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Heading from '../components/Heading';
import LatestWorkouts from '../components/LatestWorkouts';
import ExercisesLibrary from '../components/ExercisesLibrary';
import Goals from '../components/Goals';
import Languages from '../languages';
import LanguageContext from '../languages/LanguageContext';
import Levels from '../components/Levels';
import LatestDiets from '../components/LatestDiets';

export default function Home(props) {

  const { height } = useWindowDimensions();
  const contextState = React.useContext(LanguageContext);
  const language = contextState.language;
  const Strings = Languages[language].texts;

  const onChangeScreen = (screen) => {
    props.navigation.navigate(screen);
};

  const sections = [
    {key: 'workouts', content: <><Heading title={Strings.ST23} button={() => onChangeScreen('workouts')}/><LatestWorkouts/></>},
    {key: 'goals', content: <><Heading title={Strings.ST22} button={() => onChangeScreen('goals')}/><Goals/></>},
    {key: 'levels', content: <><Heading title={Strings.ST24} button={() => onChangeScreen('levels')}/><Levels/></>},
    {key: 'library', content: <ExercisesLibrary/>},
    {key: 'diets', content: <><Heading title={Strings.ST47} button={() => onChangeScreen('diets')}/><LatestDiets/></>},
  ];

  const renderSection = ({item}) => (
    <View style={{width: '100%'}}>{item.content}</View>
  );

 return (
  <SafeAreaView style={{flex: 1}}>
    <FlatList
      style={{width: '100%', height: Math.max(0, height - 56)}}
      data={sections}
      renderItem={renderSection}
      keyExtractor={(item) => item.key}
      contentContainerStyle={{paddingBottom: 32}}
      scrollEnabled={true}
      nestedScrollEnabled={true}
      showsVerticalScrollIndicator={false}
      removeClippedSubviews={false}
    />
  </SafeAreaView>

      );

}
