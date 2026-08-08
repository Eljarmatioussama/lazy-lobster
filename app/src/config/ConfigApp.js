//////////////////// CONFIG APP

import Constants from 'expo-constants';
import { Platform } from 'react-native';

const isStandAloneApp = Constants.appOwnership == "standalone";
// Expo Go on a physical device cannot reach localhost or the emulator-only
// 10.0.2.2 address. Expo exposes the Metro host URI, which is the computer's
// LAN address when Expo is started with --lan.
const expoHost = Constants.expoConfig?.hostUri?.split(':')[0];
const localApiHost = expoHost || (Platform.OS === 'android' ? '10.0.2.2' : 'localhost');
const localApiUrl = `http://${localApiHost}:8080/`;
const apiUrl = process.env.EXPO_PUBLIC_API_URL || localApiUrl;

const ConfigApp = {

    // backend url (with slash at end)
    // 10.0.2.2 = host machine from Android emulator (Docker on localhost:8080)
    URL: apiUrl.endsWith('/') ? apiUrl : `${apiUrl}/`,

    DEFAULTLANG: "en",

    THEMEMODE: "light", // light or dark

    // testdevice id, DON'T CHANGE IT
    TESTDEVICE_ID : isStandAloneApp ? "EMULATOR" : "EMULATOR"

};

export default ConfigApp;
