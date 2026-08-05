import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
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

export default function Days(props) {

    const contextState = React.useContext(LanguageContext);
    const language = contextState.language;
    const Strings = Languages[language].texts;

    const {Number, WorkoutId} = props;

    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayDetails = [
        ['Morning Flow', '20 min', '✓ Completed'],
        ['Gentle Stretch', '15 min', '▶ Continue'],
        ['Balance Practice', '25 min', 'Start →'],
        ['Strength Flow', '20 min', 'Start →'],
        ['Recovery Session', '15 min', 'Start →'],
        ['Core Practice', '20 min', 'Start →'],
        ['Full Body Flow', '25 min', 'Start →']
    ];

    const totalDays = Array.from(Array(Number).keys());
    const [completedDays, setCompletedDays] = useState([]);
    const [dayDurations, setDayDurations] = useState({});

    useEffect(() => {
        const uid = auth.currentUser?.uid;
        if (!uid) return;
        AsyncStorage.getItem(`workoutProgress_${uid}_${WorkoutId}`).then((value) => {
            if (value) setCompletedDays(JSON.parse(value));
        });
    }, [WorkoutId]);

    useEffect(() => {
      weekdays.forEach((_, index) => getWorkoutByDay(WorkoutId, index + 1).then(items => {
        const total = (items || []).reduce((sum, item) => sum + Number(item.video_duration || 0), 0);
        setDayDurations(previous => ({...previous, [index + 1]: total}));
      }));
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

    <View key={i} style={Styles.DayCard}>
      <View style={Styles.DayCardContent}>
        <Text style={Styles.DayCardLabel}>{weekdays[i]}</Text>
        <Text style={Styles.DayCardDuration}>{dayDurations[i + 1] ? `${Math.ceil(dayDurations[i + 1] / 60)} min` : 'Calculating…'}</Text>
      </View>
    </View>

    ))}

    </View>

        );

}
