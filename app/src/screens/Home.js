import React from 'react';
import { FlatList, View, useWindowDimensions, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Heading from '../components/Heading';
import LatestWorkouts from '../components/LatestWorkouts';
import ExercisesLibrary from '../components/ExercisesLibrary';
import Goals from '../components/Goals';
import Languages from '../languages';
import LanguageContext from '../languages/LanguageContext';
import Levels from '../components/Levels';
import CollapsibleHeader from '../components/CollapsibleHeader';

export default function Home(props) {
  const { height } = useWindowDimensions();
  const contextState = React.useContext(LanguageContext);
  const language = contextState.language;
  const Strings = Languages[language].texts;
  const lastOffset = React.useRef(0);
  const scrollY = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => { props.navigation.setOptions({headerShown: false}); }, [props.navigation]);
  const onChangeScreen = (screen) => { props.navigation.navigate(screen); };
  const sections = [
    {key: 'workouts', content: <><Heading title={Strings.ST23} button={() => onChangeScreen('workouts')}/><LatestWorkouts/></>},
    {key: 'goals', content: <><Heading title={Strings.ST22} button={() => onChangeScreen('goals')}/><Goals/></>},
    {key: 'levels', content: <><Heading title={Strings.ST24} button={() => onChangeScreen('levels')}/><Levels/></>},
    {key: 'library', content: <ExercisesLibrary/>},
  ];
  return <SafeAreaView style={{flex: 1}}><CollapsibleHeader title="Limbotic" titleStyle={{fontSize:22, fontWeight:'900', letterSpacing:1.8, textTransform:'uppercase'}} navigation={props.navigation} scrollY={scrollY}/><Animated.FlatList style={{width: '100%', height: Math.max(0, height - 56)}} data={sections} renderItem={({item}) => <View style={{width: '100%'}}>{item.content}</View>} keyExtractor={(item) => item.key} contentContainerStyle={{paddingTop:68,paddingBottom:32}} showsVerticalScrollIndicator={false} removeClippedSubviews={false} onScroll={Animated.event([{nativeEvent:{contentOffset:{y:scrollY}}}],{useNativeDriver:false})} scrollEventThrottle={16}/></SafeAreaView>;
}
