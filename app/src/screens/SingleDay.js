import React, { useState, useEffect } from 'react';
import { ScrollView, View, Image, I18nManager, Animated } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context';
import Styles from '../config/Styles';
import Languages from '../languages';
import LanguageContext from '../languages/LanguageContext';
import { getWorkoutByDay } from "../config/DataApp";
import {map, size} from 'lodash';
import AppLoading from '../components/InnerLoading';
import TouchableScale from 'react-native-touchable-scale';
import { List, Text, FAB, IconButton } from 'react-native-paper';
import ColorsApp from '../config/ColorsApp';
import RestDay from '../components/RestDay';
import CollapsibleHeader from '../components/CollapsibleHeader';
import DraggableFlatList from 'react-native-draggable-flatlist';

export default function SingleDay(props) {

    const { route } = props;
    const { navigation } = props;
    const { id, day, title } = route.params;

    const [isLoaded, setIsLoaded] = useState(false);
    const [items, setItems] = useState([]);
    const scrollY = React.useRef(new Animated.Value(0)).current;
  
    const contextState = React.useContext(LanguageContext);
    const language = contextState.language;
    const Strings = Languages[language].texts;

    const rightIcon = I18nManager.isRTL ? "chevron-left" : "chevron-right";

    const onClickItem = (id, title) => {
      navigation.navigate('exercisedetails', {id, title});
    };

    const onClickStart = (id, day) => {
      navigation.navigate('timer', {id, day});
    };

    useEffect(() => {

          props.navigation.setOptions({
          headerShown: false,
        });
      
      }, []);

    useEffect(() => {
        getWorkoutByDay(id, day).then((response) => {
            setItems(response);
            setIsLoaded(true);
        });
      }, []);

    if (!isLoaded) {

        return (
       
              <AppLoading/>
       
             );
       
          }else{
    
if(size(items) >= 1){

    return (
    
      <View style={{flex: 1}}>
          <CollapsibleHeader title="" navigation={navigation} scrollY={scrollY}
            left={<IconButton icon="chevron-left" mode="contained" containerColor="#dceee5" size={24} style={{marginVertical: 0}} onPress={() => navigation.goBack()} />} />
      <SafeAreaView>
      
      
          <DraggableFlatList data={items} keyExtractor={(item, index) => String(item.id || index)} contentContainerStyle={{paddingTop: 84, paddingBottom: 100}} onScrollOffsetChange={(offset) => scrollY.setValue(offset)} onDragEnd={({data}) => setItems(data)} renderItem={({item, getIndex, drag, isActive}) => {
            const i = getIndex() || 0;
            return (
      
          <TouchableScale style={{marginHorizontal:16, marginBottom:10, backgroundColor:'#fff', borderRadius:16, elevation:isActive ? 8 : 3, shadowColor:'#102a43', shadowOpacity:0.12, shadowRadius:8, shadowOffset:{width:0,height:3}}} activeOpacity={1} onLongPress={drag} onPress={() => onClickItem(item.id, item.title)} activeScale={0.98} tension={100} friction={10}>
          <List.Item
          key={i}
          title={item.title}
          titleStyle={{fontWeight: 'bold', fontSize:15, marginBottom: 3}}
          activeOpacity={1}
          titleNumberOfLines={2}
          underlayColor="transparent"
          rippleColor="transparent"
          left={props => 
            <View style={{flexDirection:'row', alignContent:'center', justifyContent:'center', alignItems:'center'}}>
              <Text style={{marginHorizontal:15, color: ColorsApp.PRIMARY, fontSize:18, fontWeight:'bold'}}>{i+1+'º'}</Text>
              <View style={Styles.itemListView2}>
            <Image source={{uri: item.image}} style={Styles.itemListImage2} resizeMode={"center"} />
            </View>
            </View>}
          right={props => <List.Icon {...props} icon={rightIcon} style={{alignSelf: 'center'}} style={{opacity:0.5, alignSelf:'center'}} />}
          />
          </TouchableScale>
            );
          }} />

          </SafeAreaView>

          <View>
            <FAB
          style={{marginHorizontal: 50, marginBottom:20, elevation: 0}}
          label={Strings.ST122}
          icon="play"
          onPress={() => onClickStart(id, day)}
          />
          </View>

</View>

      
            );

}else{
    return(

        <RestDay/>

    )
}
    
    }
    
    }
    
    
    
