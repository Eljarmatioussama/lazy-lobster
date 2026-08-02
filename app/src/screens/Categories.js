import React, { useState, useEffect } from 'react';
import { ScrollView, View, I18nManager, useWindowDimensions } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context';
import Styles from '../config/Styles';
import Languages from '../languages';
import LanguageContext from '../languages/LanguageContext';
import { getCategories } from "../config/DataApp";
import AppLoading from '../components/InnerLoading';
import TouchableScale from 'react-native-touchable-scale';
import { List, Avatar } from 'react-native-paper';
import {map} from 'lodash';
import ColorsApp from '../config/ColorsApp';

export default function Categories(props) {

  const { height } = useWindowDimensions();

  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  const contextState = React.useContext(LanguageContext);
  const language = contextState.language;
  const Strings = Languages[language].texts;

  const rightIcon = I18nManager.isRTL ? "chevron-left" : "chevron-right";
  
  const onClickItem = (id, title) => {
    props.navigation.navigate('singlecategory', {id, title});
  };

  useEffect(() => {
    getCategories().then((response) => {
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

  <ScrollView
  style={{width: '100%', height: Math.max(0, height - 56)}}
  contentContainerStyle={{paddingBottom: 32}}
  showsHorizontalScrollIndicator={false}
  showsVerticalScrollIndicator={false}
  scrollEnabled={true}
  nestedScrollEnabled={true}
>
    
<SafeAreaView>

    <View style={Styles.ContentScreen}>

        {map(items, (item, i) => (

        <TouchableScale key={i} activeOpacity={1} onPress={() => onClickItem(item.id, item.title)} activeScale={0.98} tension={100} friction={10}>
            <List.Item
            key={i}
            title={item.title}
            titleStyle={{fontWeight: 'bold', fontSize:15, marginBottom: 3}}
            activeOpacity={1}
            description={item.total +' '+ Strings.ST63}
            titleNumberOfLines={2}
            underlayColor="transparent"
            rippleColor="transparent"
            left={props => <Avatar.Image size={80} style={{marginRight: 10}} source={{uri: item.image}} />}
            right={props => <List.Icon {...props} icon={rightIcon} style={{alignSelf: 'center', opacity: 0.3, marginBottom:30}} color={ColorsApp.PRIMARY} />}
            />
        </TouchableScale>

        ))}


    </View>
    </SafeAreaView>
    </ScrollView>

      );

}

}


