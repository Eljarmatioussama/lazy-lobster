import React from 'react';
import { I18nManager } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { IconButton } from 'react-native-paper';
import Languages from '../languages';
import LanguageContext from '../languages/LanguageContext';
import usePreferences from '../hooks/usePreferences';
import ExerciseDetails from '../screens/ExerciseDetails';
import StackNavigation from './StackNavigation';
import Player from '../screens/Player';
import WorkoutDetails from '../screens/WorkoutDetails';
import SingleDay from '../screens/SingleDay';
import DietDetails from '../screens/DietDetails';
import ProductDetails from '../screens/ProductDetails';
import PostDetails from '../screens/PostDetails';
import Timer from '../screens/Timer';
import ColorsApp from '../config/ColorsApp';
import Completed from '../screens/Completed';

const RootStack = createStackNavigator();

export default function ModalNavigation(props){

  const contextState = React.useContext(LanguageContext);
  const language = contextState.language;
  const Strings = Languages[language].texts;
  const {theme} = usePreferences();

  const buttonClose = (navigation) => {
	const goBack = () => {
		if (navigation.canGoBack()) navigation.goBack();
	};
	return (
		<IconButton icon={"window-close"} iconColor={theme === "light" ? '#000' : '#fff'} style={{marginLeft:15}} size={24} onPress={goBack}/>
		)
};

const buttonCloseLight = (navigation) => {
	const goBack = () => {
		if (navigation.canGoBack()) navigation.goBack();
	};
	return (
		<IconButton icon={"window-close"} iconColor={"#fff"} style={{marginLeft:15}} size={24} onPress={goBack}/>
		)
};

const buttonCloseColor = (navigation) => {
	return (
		<IconButton icon={"window-close"} iconColor={ColorsApp.PRIMARY} style={{marginLeft:15}} size={24} onPress={() => navigation.goBack()}/>
		)
};

const buttonBack = (navigation) => {
	const goBack = () => {
		if (navigation.canGoBack()) navigation.goBack();
	};
	return (
		<IconButton icon={I18nManager.isRTL ? "chevron-right" : "chevron-left"} mode="contained" containerColor="#f0f0f0" size={24} style={{marginLeft:8, marginVertical:0}} onPress={goBack}/>
		)
};

const buttonBackToHome = () => {
	return (
		<IconButton icon={I18nManager.isRTL ? "arrow-right" : "arrow-left"} iconColor={theme === "light" ? '#000' : '#fff'} style={{marginLeft:15}} size={24} onPress={() => props.navigation.navigate('home')}/>
		)
};

	const navigatorOptions = {
		headerStyle: {
			height: 48,
			shadowColor: 'transparent',
			elevation: 0,
			shadowOpacity: 0,
			backgroundColor: theme === "light" ? '#fff' : '#000'
		},
		headerTitleAlign: 'center',
		presentation: 'modal',
		gestureEnabled: false,
		/*cardOverlayEnabled: true,
		...TransitionPresets.ModalPresentationIOS*/
	}

return (
    <RootStack.Navigator screenOptions={navigatorOptions}>
      <RootStack.Screen name="Main" component={StackNavigation} options={{ headerShown: false }}/>
      <RootStack.Screen name="exercisedetails" component={ExerciseDetails} options={({navigation}) => ({presentation: 'fullScreenModal', title: Strings.ST80, headerLeft: () => buttonClose(navigation)})} />
      <RootStack.Screen name="workoutdetails" component={WorkoutDetails} options={{presentation: 'fullScreenModal', headerShown: false, header: () => null}} />
      <RootStack.Screen name="dietdetails" component={DietDetails} options={({navigation}) => ({presentation: 'fullScreenModal', headerTransparent: true, title: null, headerLeft: () => buttonBack(navigation)})} />
      <RootStack.Screen name="productdetails" component={ProductDetails} options={({navigation}) => ({presentation: 'fullScreenModal', headerTransparent: true, title: null, headerLeft: () => buttonBack(navigation)})} />
      <RootStack.Screen name="postdetails" component={PostDetails} options={({navigation}) => ({presentation: 'fullScreenModal', headerTransparent: true, title: null, headerLeft: () => buttonBack(navigation)})} />
      <RootStack.Screen name="player" component={Player} options={{headerTransparent: true, title: null}} />
      <RootStack.Screen name="timer" component={Timer} options={{headerTransparent: true, title: null, headerLeft: null}} />
      <RootStack.Screen name="singleday" component={SingleDay} options={({navigation}) => ({presentation: 'card', headerShown: true, headerLeft: () => buttonBack(navigation)})} />
      <RootStack.Screen name="completed" component={Completed} options={{headerTransparent: true, title: null, headerLeft: null}} />
    </RootStack.Navigator>
	)
}
