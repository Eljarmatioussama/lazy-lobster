//////////////////// CONFIG APP

import Constants from 'expo-constants';
import { Platform } from 'react-native';

const isStandAloneApp = Constants.appOwnership == "standalone";
const localApiUrl = `http://${Platform.OS === 'android' ? '10.0.2.2' : 'localhost'}:8080/`;
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
