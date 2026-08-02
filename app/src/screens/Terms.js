import React, { useState, useEffect } from 'react';
import { getStrings } from "../config/DataApp";
import { View, ScrollView, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import { HTMLStyles } from '../config/HTMLStyles';
import { HTMLStylesDark } from '../config/HTMLStylesDark';
import HTMLView from 'react-native-render-html';
import Styles from '../config/Styles';
import AppLoading from '../components/InnerLoading';
import usePreferences from '../hooks/usePreferences';

export default function Terms() {

  const { width } = useWindowDimensions();
  const {theme} = usePreferences();
	const [isLoaded, setIsLoaded] = useState(false);
	const [item, setItem] = useState(null);
	const [error, setError] = useState(false);

useEffect(() => {
  getStrings()
    .then((response) => {
      if (Array.isArray(response) && response[0]) {
        setItem(response[0]);
      } else {
        setError(true);
      }
    })
    .catch(() => setError(true))
    .finally(() => setIsLoaded(true));
}, []);

  if (isLoaded) {

 return (

	<ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
    <SafeAreaView>
    <View style={Styles.GuestPageScreen}>
    {error ? (
      <Text>Privacy & Terms could not be loaded. Check that the local API is running and reachable.</Text>
    ) : (
      <HTMLView source={{html: item.st_termsconditions || item.st_privacypolicy || `<p></p>`}} contentWidth={width} tagsStyles={theme === "light" ? HTMLStyles : HTMLStylesDark}/>
    )}
    </View>
    </SafeAreaView>
    </ScrollView>

      );

    }else{
   return (
     <AppLoading/>
     );
 }
 
}
