import React, { useState, useEffect } from 'react';
import { ScrollView, View, Image, I18nManager, Animated } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context';
import Styles from '../config/Styles';
import Languages from '../languages';
import LanguageContext from '../languages/LanguageContext';
import { getWorkoutByDay } from "../config/DataApp";
import { getExerciseProgress } from "../config/DataApp";
import {map, size} from 'lodash';
import AppLoading from '../components/InnerLoading';
import TouchableScale from 'react-native-touchable-scale';
import { List, Text, FAB, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    const [progress, setProgress] = useState({});
    const scrollY = React.useRef(new Animated.Value(0)).current;
  
    const contextState = React.useContext(LanguageContext);
    const language = contextState.language;
    const Strings = Languages[language].texts;


    const onClickItem = (id, title) => {
      navigation.navigate('exercisedetails', {id, title});
    };

    const onClickStart = (id, day) => {
      // Keep the order created by the user in the draggable list. The timer
      // uses this snapshot instead of fetching the original server order.
      navigation.navigate('timer', {id, day, orderedItems: items});
    };

    useEffect(() => {

          props.navigation.setOptions({
          headerShown: false,
        });
      
      }, []);

    useEffect(() => {
        getWorkoutByDay(id, day).then((response) => {
            setItems(response);
            Promise.all((response || []).map(async exercise => [exercise.id, await getExerciseProgress(exercise.id)]))
              .then(values => setProgress(Object.fromEntries(values)));
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
            left={<IconButton icon="chevron-left" mode="contained" containerColor="#f0f0f0" size={24} style={{marginVertical: 0}} onPress={() => navigation.goBack()} />} />
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
              <View style={{width:54, marginHorizontal:10, alignItems:'center'}}>
                <Text style={{color: ColorsApp.PRIMARY, fontSize:12, fontWeight:'bold'}}>{Math.round(Number(progress[item.id] || 0))}%</Text>
                <View style={{width:42, height:5, marginTop:4, borderRadius:3, backgroundColor:'#dce8e3', overflow:'hidden'}}>
                  <View style={{width:`${Math.min(100, Number(progress[item.id] || 0))}%`, height:'100%', backgroundColor:ColorsApp.PRIMARY}} />
                </View>
              </View>
              <View style={Styles.itemListView2}>
            <Image source={{uri: item.image}} style={Styles.itemListImage2} resizeMode={"center"} />
            </View>
            </View>}
          right={props => <List.Icon {...props} icon="drag-vertical" color="#8fa3ad" style={{opacity:0.7, alignSelf:'center'}} />}
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
    
    
    
