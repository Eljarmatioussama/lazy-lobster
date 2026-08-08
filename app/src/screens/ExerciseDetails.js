import React, { useState, useEffect } from 'react';
import { ScrollView, View, ImageBackground, Platform, useWindowDimensions } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context';
import Styles from '../config/Styles';
import Languages from '../languages';
import LanguageContext from '../languages/LanguageContext';
import usePreferences from '../hooks/usePreferences';
import { getExercisesById } from "../config/DataApp";
import AppLoading from '../components/InnerLoading';
import { Text, IconButton, List, Caption, Paragraph, Subheading } from 'react-native-paper';
import { Col, Grid } from 'react-native-easy-grid';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ColorsApp from '../config/ColorsApp';
import { HTMLStyles } from '../config/HTMLStyles';
import { HTMLStylesDark } from '../config/HTMLStylesDark';
import HTMLView from 'react-native-render-html';
import VideoPlayer from '../components/VideoPlayer';
import ConfigApp from '../config/ConfigApp';

export default function SingleExercise(props) {

  const { width } = useWindowDimensions();
  const { route } = props;
  const { id, title } = route.params;
  const {theme} = usePreferences();

  const [showInfo, setShowInfo] = useState(false);
  const [showInst, setShowInst] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [item, setItem] = useState([]);

  const contextState = React.useContext(LanguageContext);
  const language = contextState.language;
  const Strings = Languages[language].texts;

  const pressShowInfo = () => setShowInfo(!showInfo);
  const pressShowInst = () => setShowInst(!showInst);
  const pressShowTips = () => setShowTips(!showTips);

  const mediaUrl = (url) => {
    if (!url) return url;
    const value = String(url).trim();
    return value.replace('http://localhost:8080', ConfigApp.URL.replace(/\/$/, ''));
  };

  const videoUrl = mediaUrl(item?.video);
  const imageUrl = mediaUrl(item?.image);
  const hasVideo = !!videoUrl
    && /^https?:\/\//i.test(videoUrl)
    && !/yourvideolink\.com/i.test(videoUrl);
  
  useEffect(() => {
    getExercisesById(id).then((response) => {
        setItem(response[0]);
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
  showsHorizontalScrollIndicator={false}
  showsVerticalScrollIndicator={false}
>
    
<SafeAreaView>

    <View style={Styles.ModalScreen}>

    {hasVideo ? (
      <VideoPlayer videoUrl={videoUrl} thumbnail={imageUrl} title={item.title} />
    ) : (
    <ImageBackground source={{uri: imageUrl}} style={Styles.ExerciseImage} resizeMode={'cover'} imageStyle={{borderRadius:8}}>
      <View style={Styles.ExerciseImageView} />
    </ImageBackground>
    )}
    
    <Text style={Styles.ExerciseTitle}>{item.title}</Text>
    <Text style={Styles.ExerciseSubTitle}></Text>


    <View style={{marginVertical:20, marginBottom:10}}>

      <List.Accordion
        title={Strings.ST84}
        titleStyle={Styles.ExerciseAccordionTitle}
        expanded={showInfo}
        style={Styles.ExerciseAccordion}
        onPress={pressShowInfo}>
      </List.Accordion>

      {showInfo ?
      <View style={Styles.ExerciseAccordionView}>
        <Subheading>{Strings.ST87}</Subheading>
        <Caption style={Styles.ExerciseInfoCaption}>{item.level}</Caption>

        <Subheading>{Strings.ST88}</Subheading>
        <Caption style={Styles.ExerciseInfoCaption}>{item.bodyparts}</Caption>

      </View>
      : null
      }

</View>


<View style={{marginBottom:10}}>

<List.Accordion
        title={Strings.ST85}
        titleStyle={Styles.ExerciseAccordionTitle}
        expanded={showInst}
        style={Styles.ExerciseAccordion}
        onPress={pressShowInst}>
      </List.Accordion>

      {showInst ?
      <View style={Styles.ExerciseAccordionView}>
            <HTMLView source={{html: item.instructions ? item.instructions : `<p></p>`}} contentWidth={width} tagsStyles={theme === "light" ? HTMLStyles : HTMLStylesDark}/>
      </View>
      : null
      }

    </View>


    <View style={{marginBottom:20}}>

      <List.Accordion
        title={Strings.ST86}
        titleStyle={Styles.ExerciseAccordionTitle}
        expanded={showTips}
        style={Styles.ExerciseAccordion}
        onPress={pressShowTips}>
      </List.Accordion>

      {showTips ?
      <View style={Styles.ExerciseAccordionView}>
            <HTMLView source={{html: item.tips ? item.tips : `<p></p>`}} contentWidth={width} tagsStyles={theme === "light" ? HTMLStyles : HTMLStylesDark}/>
      </View>
      : null
      }

    </View>

    </View>
    </SafeAreaView>
    </ScrollView>

      );

}

}


