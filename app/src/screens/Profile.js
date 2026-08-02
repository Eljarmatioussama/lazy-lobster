import React, { useState, useEffect } from 'react';
import { signOut, EmailAuthProvider, deleteUser, reauthenticateWithCredential, updateProfile } from 'firebase/auth';
import { auth } from '../config/ConfigFirebase';
import { ScrollView, View, Image, Alert, TouchableOpacity, ActivityIndicator } from 'react-native'; import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import ConfigApp from '../config/ConfigApp';
import AppLoading from '../components/InnerLoading';
import CustomButton from '../components/CustomButton';
import Styles from '../config/Styles';
import Languages from '../languages';
import LanguageContext from '../languages/LanguageContext';
import { Text, Button, Paragraph, Dialog, Portal, TextInput, Title } from 'react-native-paper';


export default function Profile(props) {

  const contextState = React.useContext(LanguageContext);
  const language = contextState.language;
  const Strings = Languages[language].texts;

  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState([]);
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const pickProfilePicture = async () => {
    if (isUploading) return;
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow photo library access to choose a profile picture.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.85 });
    if (result.canceled || !result.assets?.[0]?.uri || !auth.currentUser) return;
    try {
      setIsUploading(true);
      const asset = result.assets[0];
      const response = await fetch(asset.uri);
      const blob = await response.blob();
      const formData = new FormData();
      formData.append('user_id', auth.currentUser.uid);
      formData.append('profile', blob, `profile.${asset.uri.split('.').pop() || 'jpg'}`);
      const uploadResponse = await fetch(`${ConfigApp.URL}controller/upload_profile_picture.php`, { method: 'POST', body: formData });
      const uploadResult = await uploadResponse.json();
      if (!uploadResponse.ok || !uploadResult.url) throw new Error(uploadResult.error || 'Upload failed');
      const photoURL = uploadResult.url;
      await updateProfile(auth.currentUser, { photoURL });
      setUser({...auth.currentUser});
    } catch (error) {
      console.error('Profile picture upload failed', error);
      Alert.alert('Upload failed', 'Your profile picture could not be uploaded. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const onChangeScreen = (screen) => {
    props.navigation.navigate(screen);
  };

  const deleteAccount = () => {

    if (password) {

      let credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        password
      );

      reauthenticateWithCredential(auth.currentUser, credential).then(() => {

        deleteUser(user).then(() => {
          // User deleted.
          }).catch((error) => {
            console.log(error);
            Alert.alert(Strings.ST32);
          });

      }).catch((error) => {
            console.log(error);
            Alert.alert(Strings.ST32);
      });
    }
  };

  const hideDialog = () => setVisible(false);

  useEffect(() => {

      setUser(auth.currentUser);
      setIsLoaded(true);

  }, []);

if(isLoaded) {

 return (

  <ScrollView contentContainerStyle={{paddingBottom: 24}} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false}>
  <SafeAreaView>

  <View style={Styles.HeaderProfile}>
    <TouchableOpacity onPress={pickProfilePicture} activeOpacity={0.85} style={Styles.ProfileImageButton} accessibilityRole="button" accessibilityLabel="Change profile picture">
      {user.photoURL ? <Image source={{uri: user.photoURL}} style={Styles.ImageProfile} resizeMode={"cover"}/>
      : <Image source={require('../../assets/male.jpg')} style={Styles.ImageProfile} resizeMode={"cover"}/>}
      <View style={Styles.ProfileCameraBadge}>
        {isUploading ? <ActivityIndicator size="small" color="#fff" /> : <Icon name="camera" size={18} color="#fff" />}
      </View>
    </TouchableOpacity>
  
    <View style={{flexDirection: 'row'}}>
    {user.displayName ? <Text style={Styles.TextProfile}>{user.displayName}</Text> : null}
    {user.user_verified ? <Icon name="check-decagram" size={22} style={Styles.memberBadge}/> : null}
    </View>
  <Text style={Styles.SmallTextProfile}>{user.email}</Text>
  </View>

  <View style={{marginHorizontal: 30, marginBottom: 40}}>
  <CustomButton Icon="dumbbell" Label={Strings.ST50} Click={() => onChangeScreen("customworkouts")}/>
  <CustomButton Icon="silverware-fork-knife" Label={Strings.ST51} Click={() => onChangeScreen("customdiets")}/>
  <CustomButton Icon="heart-outline" Label={Strings.ST4} Click={() => onChangeScreen("favorites")}/>
  <CustomButton Icon="bookmark-outline" Label={Strings.ST110} Click={() => onChangeScreen("about")}/>
  <CustomButton Icon="file-document-outline" Label={Strings.ST8} Click={() => onChangeScreen("terms")}/>
  <CustomButton Icon="logout" Label={Strings.ST9} Click={() => signOut(auth)}/>
  <CustomButton Icon="account-cancel-outline" Label={Strings.ST141} Click={() => setVisible(true)}/>

  <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Content>
          <Title>{Strings.ST144}</Title>
          <Paragraph style={{marginVertical: 10}}>{Strings.ST145}</Paragraph>
          <TextInput
          value={password}
          mode="outlined"
          secureTextEntry={true}
          onChangeText={text => setPassword(text)}
        />
        </Dialog.Content>
        <Dialog.Actions style={{marginBottom: 8, marginTop: -20, marginHorizontal: 8}}>
          <Button onPress={() => hideDialog()}>{Strings.ST142}</Button>
          <Button onPress={() => deleteAccount()}>{Strings.ST143}</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>

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

