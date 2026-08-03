import * as React from 'react';
import * as ScreenOrientation from 'expo-screen-orientation';
import { View, StyleSheet, Dimensions } from 'react-native';
import VideoPlayer from '../components/VideoPlayer';
import { IconButton } from 'react-native-paper';

export default function Player(props) {

    const [inFullscreen2, setInFullsreen2] = React.useState(false);
    const { route } = props;
    const { url } = route.params;

    const closeVideo = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
      if (props.navigation.canGoBack()) {
        props.navigation.goBack();
      }
    };

    const openFullScreen = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE_LEFT)
      setInFullsreen2(!inFullscreen2)
    };

    const closeFullScreen = async () => {
      await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
      setInFullsreen2(!inFullscreen2);
    };

    const buttonLeft = () => {
      return (<IconButton icon={"window-close"} color={"white"} style={{marginLeft:15}} size={24} onPress={() => closeVideo()}/>)
    };

    const buttonRight = () => {

      if(!inFullscreen2){
        return (<IconButton icon={"fullscreen"} color={"white"} style={{marginLeft:15}} size={24} onPress={() => openFullScreen()}/>)
      }

      if(inFullscreen2){
        return (<IconButton icon={"fullscreen-exit"} color={"white"} style={{marginLeft:15}} size={24} onPress={() => closeFullScreen()}/>)
      }

    };

    React.useEffect(() => {

      props.navigation.setOptions({
        headerLeft: () => buttonLeft(),
        headerRight: () => buttonRight()
    });
    
    }, [inFullscreen2]);

  return (
    <View style={styles.container}>
    <VideoPlayer videoUrl={url} title="Video" />
  </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#000',
    }
  });
