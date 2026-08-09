import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity, Pressable} from 'react-native';
import { Text, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {map} from 'lodash';
import Styles from '../config/Styles';
import TouchableScale from 'react-native-touchable-scale';
import Languages from '../languages';
import LanguageContext from '../languages/LanguageContext';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../config/ConfigFirebase';
import { getWorkoutByDay } from '../config/DataApp';
import usePreferences from '../hooks/usePreferences';

export default function Days(props) {

    const contextState = React.useContext(LanguageContext);
    const language = contextState.language;
    const Strings = Languages[language].texts;
    const {theme} = usePreferences();
    const dark = theme === 'dark';

    const {Number: daysCount, WorkoutId} = props;

    const weekdays = [Strings.ST158, Strings.ST159, Strings.ST160, Strings.ST161, Strings.ST162, Strings.ST163, Strings.ST164];
    const dayDetails = [
        ['Morning Flow', '20 min', '✓ Completed'],
        ['Gentle Stretch', '15 min', '▶ Continue'],
        ['Balance Practice', '25 min', 'Start →'],
        ['Strength Flow', '20 min', 'Start →'],
        ['Recovery Session', '15 min', 'Start →'],
        ['Core Practice', '20 min', 'Start →'],
        ['Full Body Flow', '25 min', 'Start →']
    ];

    const totalDays = Array.from(Array(daysCount).keys());
    const [completedDays, setCompletedDays] = useState([]);
    const [dayDurations, setDayDurations] = useState({});
    const [loadedDays, setLoadedDays] = useState({});

    useEffect(() => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        AsyncStorage.getItem(`workoutProgress_${uid}_${WorkoutId}`).then((value) => {
            if (value) setCompletedDays(JSON.parse(value));
        });
    }, [WorkoutId]);

    useEffect(() => {
      weekdays.forEach((_, index) => getWorkoutByDay(WorkoutId, index + 1).then(items => {
        // Use varied demo durations when older exercises do not have a value yet.
        const total = (items || []).reduce((sum, item, itemIndex) => {
          const duration = parseFloat(item.video_duration) || (30 + (((itemIndex + 1) * 37) % 150));
          return sum + duration;
        }, 0);
        setDayDurations(previous => ({...previous, [index + 1]: total}));
        setLoadedDays(previous => ({...previous, [index + 1]: true}));
      }).catch(() => setLoadedDays(previous => ({...previous, [index + 1]: true}))));
    }, [WorkoutId]);

    const navigation = useNavigation();

    const onChangeScreen = async (id, day, title) => {
        const next = completedDays.includes(day) ? completedDays : [...completedDays, day];
        setCompletedDays(next);
        const uid = auth.currentUser?.uid;
        if (uid) await AsyncStorage.setItem(`workoutProgress_${uid}_${WorkoutId}`, JSON.stringify(next));
        navigation.navigate('singleday', {id, day, title});
      };

    return(

    <View style={{marginTop: 8, marginBottom: 40}}>

    {map(totalDays, (i) => (

    <TouchableOpacity key={i} style={[Styles.DayCard, {minHeight:78, paddingVertical:9, backgroundColor:dark ? '#1e1e1e' : '#fff', borderColor:dark ? '#3a3a3a' : '#e7ecef'}]} activeOpacity={0.85} onPress={() => onChangeScreen(WorkoutId, i + 1, weekdays[i])}>
      <View style={[Styles.DayCardContent, {alignItems:'flex-start', justifyContent:'center'}]}>
        <Text style={[Styles.DayCardLabel, {textAlign:'left', marginBottom:2, color:dark ? '#fff' : '#111'}]}>{weekdays[i]}</Text>
        <Text style={[Styles.DayCardDuration, {textAlign:'left', marginBottom:0}]}>{dayDurations[i + 1] ? `${Math.ceil(dayDurations[i + 1] / 60)} min` : Strings.ST157}</Text>
      </View>
      <Pressable
        onPress={() => onChangeScreen(WorkoutId, i + 1, weekdays[i])}
        android_ripple={{color: 'rgba(35, 145, 220, 0.18)', borderless: true}}
        style={({pressed}) => ({
          alignSelf: 'center',
          borderRadius: 20,
          opacity: pressed ? 0.65 : 1,
          transform: [{scale: pressed ? 0.9 : 1}],
        })}
      >
        <Icon name="play-circle-outline" size={28} color={Styles.DayCardIcon.color} />
      </Pressable>
    </TouchableOpacity>

    ))}

    </View>

        );

}
