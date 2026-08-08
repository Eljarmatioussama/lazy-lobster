import React from 'react';
import { View } from 'react-native';
import { I18nManager } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { IconButton } from 'react-native-paper';
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import Settings from '../screens/Settings';
import About from '../screens/About';
import Terms from '../screens/Terms';
import Workouts from '../screens/Workouts';
import Goals from '../screens/Goals';
import Languages from '../languages';
import LanguageContext from '../languages/LanguageContext';
import Levels from '../screens/Levels';
import SingleGoal from '../screens/SingleGoal';
import SingleLevel from '../screens/SingleLevel';
import SearchWorkout from '../screens/SearchWorkout';
import Exercises from '../screens/Exercises';
import usePreferences from '../hooks/usePreferences';
import Equipments from '../screens/Equipments';
import SingleEquipment from '../screens/SingleEquipment';
import SingleMuscle from '../screens/SingleMuscle';
import Diets from '../screens/Diets';
import Categories from '../screens/Categories';
import SingleCategory from '../screens/SingleCategory';
import Store from '../screens/Store';
import Products from '../screens/Products';
import Blog from '../screens/Blog';
import Tags from '../screens/Tags';
import Posts from '../screens/Posts';
import SingleType from '../screens/SingleType';
import SingleTag from '../screens/SingleTag';
import Favorites from '../screens/Favorites';
import CustomWorkouts from '../screens/CustomWorkouts';
import CustomDiets from '../screens/CustomDiets';
import Types from '../screens/Types';
import SearchDiet from '../screens/SearchDiet';

const Stack = createStackNavigator();

export default function StackNavigation(props){

  const contextState = React.useContext(LanguageContext);
  const language = contextState.language;
  const Strings = Languages[language].texts;
  const {theme} = usePreferences();

	const {navigation} = props;
	
	const navigatorOptions = {
		headerTintColor: theme === "light" ? '#000' : '#fff',
		headerStyle: {
			height: 48,
			shadowColor: 'transparent',
			elevation: 0,
			shadowOpacity: 0,
			backgroundColor: theme === "light" ? '#fff' : '#000'
		},
		headerTitleAlign: 'center',
		headerBackVisible: false,
		headerLeft: () => <View style={{width: 8}} />
	}

// ******************************** Buttons

const buttonProfile = (screenNavigation) => (
	<IconButton icon="account-circle-outline" iconColor={theme === "light" ? '#000' : '#fff'} size={25} style={{marginRight: 6, marginTop: 8, marginBottom: -8}} onPress={() => screenNavigation.navigate('profile')} />
);

return (
	<Stack.Navigator screenOptions={navigatorOptions}>
	<Stack.Screen name="home" component={Home} options={({navigation: screenNavigation}) => ({title: Strings.ST1, headerRight: () => buttonProfile(screenNavigation)})} />
	<Stack.Screen name="profile" component={Profile} options={{title: Strings.ST6}} />
	<Stack.Screen name="settings" component={Settings} options={{title: Strings.ST108}} />
	<Stack.Screen name="about" component={About} options={{title: Strings.ST110}} />
	<Stack.Screen name="terms" component={Terms} options={{title: Strings.ST8}} />
	<Stack.Screen name="workouts" component={Workouts} options={{title: Strings.ST5}} />
	<Stack.Screen name="exercises" component={Exercises} options={{title: Strings.ST21}} />
	<Stack.Screen name="equipments" component={Equipments} options={{title: Strings.ST56}} />
	<Stack.Screen name="diets" component={Diets} options={{title: Strings.ST27}} />
	<Stack.Screen name="goals" component={Goals} options={{title: Strings.ST52}} />
	<Stack.Screen name="levels" component={Levels} options={{title: Strings.ST53}} />
	<Stack.Screen name="categories" component={Categories} options={{title: Strings.ST28}} />
	<Stack.Screen name="store" component={Store} options={{title: Strings.ST45}} />
	<Stack.Screen name="products" component={Products} options={{title: Strings.ST45}} />
	<Stack.Screen name="types" component={Types} options={{title: Strings.ST71}} />
	<Stack.Screen name="blog" component={Blog} options={{title: Strings.ST29}} />
	<Stack.Screen name="tags" component={Tags} options={{title: Strings.ST72}} />
	<Stack.Screen name="posts" component={Posts} options={{title: Strings.ST29}} />
	<Stack.Screen name="singlegoal" component={SingleGoal} options={{title: null}} />
	<Stack.Screen name="singlelevel" component={SingleLevel} options={{title: null}} />
	<Stack.Screen name="singleequipment" component={SingleEquipment} options={{title: null}} />
	<Stack.Screen name="singlemuscle" component={SingleMuscle} options={{title: null}} />
	<Stack.Screen name="singlecategory" component={SingleCategory} options={{title: null}} />
	<Stack.Screen name="singletype" component={SingleType} options={{title: null}} />
	<Stack.Screen name="singletag" component={SingleTag} options={{title: null}} />
	<Stack.Screen name="searchworkout" component={SearchWorkout} options={{title: Strings.ST3}} />
	<Stack.Screen name="favorites" component={Favorites} options={{title: Strings.ST4}} />
	<Stack.Screen name="customworkouts" component={CustomWorkouts} options={{title: Strings.ST50}} />
	<Stack.Screen name="customdiets" component={CustomDiets} options={{title: Strings.ST51}} />
	<Stack.Screen name="searchdiet" component={SearchDiet} options={{title: Strings.ST27}} />
	</Stack.Navigator>
	)
}
