import React, {useEffect, useState} from 'react';
import {ScrollView, View, I18nManager} from 'react-native';
import {Searchbar, List, Avatar, IconButton} from 'react-native-paper';
import TouchableScale from 'react-native-touchable-scale';
import AppLoading from '../components/InnerLoading';
import EmptyResults from '../components/EmptyResults';
import Languages from '../languages';
import LanguageContext from '../languages/LanguageContext';
import Styles from '../config/Styles';
import {getLatestDiets} from '../config/DataApp';

export default function SearchDiet(props) {
  const {language} = React.useContext(LanguageContext);
  const Strings = Languages[language].texts;
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loaded, setLoaded] = useState(true);
  useEffect(() => {
    if (query.trim().length < 3) { setResults([]); return; }
    setLoaded(false);
    getLatestDiets(1, query.trim()).then(value => { setResults(Array.isArray(value) ? value : []); setLoaded(true); });
  }, [query]);
  return <View style={{flex:1}}><View style={{flexDirection:'row', alignItems:'center'}}><Searchbar placeholder={Strings.ST54} autoCorrect={false} autoCapitalize="none" onChangeText={setQuery} style={[Styles.SearchInput, {flex:1}]} inputStyle={Styles.SearchInputStyle}/><IconButton icon="close" size={24} onPress={() => props.navigation.navigate('diets')} /></View><ScrollView><View style={Styles.ContentScreen}>{results.map((item, i) => <TouchableScale key={i} onPress={() => props.navigation.navigate('dietdetails', {id:item.id, title:item.title})}><List.Item title={item.title} titleStyle={{fontWeight:'bold', fontSize:15}} description={`${item.calories || ''}  ·  ${item.servings || ''}`} left={() => <Avatar.Image size={70} style={{marginRight:10}} source={{uri:item.image}}/>} right={p => <List.Icon {...p} icon={I18nManager.isRTL ? 'chevron-left' : 'chevron-right'}/>}/></TouchableScale>)}{loaded && results.length === 0 && query.length >= 3 ? <EmptyResults/> : null}</View></ScrollView></View>;
}
