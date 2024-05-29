// Import necessary modules
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Screen} from 'react-native-screens';
import RoleScreen from './Screens/ROLE_SCREEN';

import DrtLogin from './Screens/Director/DRT_LOGIN';
import DrtScreen01 from './Screens/Director/DRT_SCREEN_01';
import DrtScreen02 from './Screens/Director/DRT_SCREEN_02';
import DrtScreen03 from './Screens/Director/DRT_SCREEN_03';
import DrtScreen04 from './Screens/Director/DRT_SCREEN_04';
import DrtScreen05 from './Screens/Director/DRT_SCREEN_05';
import DrtScreen06 from './Screens/Director/DRT_SCREEN_06';
import DrtScreen08 from './Screens/Director/DRT_SCREEN_08';

import DtcLogin from './Screens/Datacell/DTC_LOGIN';
import DtcScreen01 from './Screens/Datacell/DTC_SCREEN_01';
import DtcScreen02 from './Screens/Datacell/DTC_SCREEN_02';
import DtcScreen03 from './Screens/Datacell/DTC_SCREEN_03';
import DtcScreen04 from './Screens/Datacell/DTC_SCREEN_04';
import DtcScreen05 from './Screens/Datacell/DTC_SCREEN_05';
import DtcScreen06 from './Screens/Datacell/DTC_SCREEN_06';
import DtcScreen07 from './Screens/Datacell/DTC_SCREEN_07';

import HodLogin from './Screens/Hod/HOD_LOGIN';
import HodScreen01 from './Screens/Hod/HOD_SCREEN_01';
import HodScreen02 from './Screens/Hod/HOD_SCREEN_02';
import HodScreen03 from './Screens/Hod/HOD_SCREEN_03';
import HodScreen04 from './Screens/Hod/HOD_SCREEN_04';
import HodScreen05 from './Screens/Hod/HOD_SCREEN_05';
import HodScreen06 from './Screens/Hod/HOD_SCREEN_06';
import HodScreen07 from './Screens/Hod/HOD_SCREEN_07';
import HodScreen08 from './Screens/Hod/HOD_SCREEN_08';
import HodScreen09 from './Screens/Hod/HOD_SCREEN_09';
import HodScreen10 from './Screens/Hod/HOD_SCREEN_10';
import HodScreen11 from './Screens/Hod/HOD_SCREEN_11';
import HodScreen12 from './Screens/Hod/HOD_SCREEN_12';
import HodScreen13 from './Screens/Hod/HOD_SCREEN_13';

import FctLogin from './Screens/Faculty/FCT_LOGIN';
import FctScreen01 from './Screens/Faculty/FCT_SCREEN_01';
import FctScreen02 from './Screens/Faculty/FCT_SCREEN_02';
import FctScreen03 from './Screens/Faculty/FCT_SCREEN_03';
import FctScreen04 from './Screens/Faculty/FCT_SCREEN_04';
import FctScreen05 from './Screens/Faculty/FCT_SCREEN_05';
import FctScreen06 from './Screens/Faculty/FCT_SCREEN_06';
import FctScreen07 from './Screens/Faculty/FCT_SCREEN_07';
import FctScreen09 from './Screens/Faculty/FCT_SCREEN_09';
import FctScreen10 from './Screens/Faculty/FCT_SCREEN_10';
import FctScreen14 from './Screens/Faculty/FCT_SCREEN_14';
import FctScreen15 from './Screens/Faculty/FCT_SCREEN_15';

const Stack1 = createNativeStackNavigator(); // Datacell Stack
const Stack2 = createNativeStackNavigator(); // Faculty Stack
const Stack3 = createNativeStackNavigator(); // Hod Stack
const Stack4 = createNativeStackNavigator(); // Director Stack

//StackAnimationTypes = 'default' | 'fade' | 'fade_from_bottom' | 'flip' | 'none' | 'simple_push' | 'slide_from_bottom' | 'slide_from_right' | 'slide_from_left'
export default function App() {
  return (
    <NavigationContainer>
      <Stack1.Navigator
        initialRouteName="RoleScreen"
        screenOptions={{
          animation: 'simple_push',
          orientation: 'portrait',
          statusBarHidden: false,
          //statusBarColor: '#00E9CC',
        }}>
        <Stack1.Screen
          name="RoleScreen"
          component={RoleScreen}
          options={{headerShown: false}}
        />

        {/* /////// DATACELL SCREENS */}

        <Stack1.Screen
          name="DtcLogin"
          component={DtcLogin}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="DtcScreen01"
          component={DtcScreen01}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="DtcScreen02"
          component={DtcScreen02}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="DtcScreen03"
          component={DtcScreen03}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="DtcScreen04"
          component={DtcScreen04}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="DtcScreen05"
          component={DtcScreen05}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="DtcScreen06"
          component={DtcScreen06}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="DtcScreen07"
          component={DtcScreen07}
          options={{headerShown: false}}
        />

        {/* //////////// HOD SCREENS */}

        <Stack1.Screen
          name="HodLogin"
          component={HodLogin}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="HodScreen01"
          component={HodScreen01}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="HodScreen02"
          component={HodScreen02}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="HodScreen03"
          component={HodScreen03}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="HodScreen04"
          component={HodScreen04}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="HodScreen05"
          component={HodScreen05}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="HodScreen06"
          component={HodScreen06}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="HodScreen07"
          component={HodScreen07}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="HodScreen08"
          component={HodScreen08}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="HodScreen09"
          component={HodScreen09}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="HodScreen10"
          component={HodScreen10}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="HodScreen11"
          component={HodScreen11}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="HodScreen12"
          component={HodScreen12}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="HodScreen13"
          component={HodScreen13}
          options={{headerShown: false}}
        />

        {/* //////// FACULTY SCREENS */}

        <Stack1.Screen
          name="FctLogin"
          component={FctLogin}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="FctScreen01"
          component={FctScreen01}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="FctScreen02"
          component={FctScreen02}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="FctScreen03"
          component={FctScreen03}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="FctScreen04"
          component={FctScreen04}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="FctScreen05"
          component={FctScreen05}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="FctScreen06"
          component={FctScreen06}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="FctScreen07"
          component={FctScreen07}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="FctScreen09"
          component={FctScreen09}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="FctScreen10"
          component={FctScreen10}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="FctScreen14"
          component={FctScreen14}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="FctScreen15"
          component={FctScreen15}
          options={{headerShown: false}}
        />

        {/* /////// DIRECTOR SCREENS */}

        <Stack1.Screen
          name="DrtLogin"
          component={DrtLogin}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="DrtScreen01"
          component={DrtScreen01}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="DrtScreen02"
          component={DrtScreen02}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="DrtScreen03"
          component={DrtScreen03}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="DrtScreen04"
          component={DrtScreen04}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="DrtScreen05"
          component={DrtScreen05}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="DrtScreen06"
          component={DrtScreen06}
          options={{headerShown: false}}
        />
        <Stack1.Screen
          name="DrtScreen08"
          component={DrtScreen08}
          options={{headerShown: false}}
        />
      </Stack1.Navigator>
    </NavigationContainer>
  );
}
