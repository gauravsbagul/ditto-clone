import { createStackNavigator } from '@react-navigation/stack'
import { useObservableState } from 'observable-hooks'
import React from 'react'
import { Image } from 'react-native'

import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../constants'
import auth from '../../scenes/auth/authService'
import LandingScreen from '../../scenes/auth/LandingScreen'
import LoginScreen from '../../scenes/auth/LoginScreen'
import SettingsScreen from '../../scenes/settings/SettingsScreen'
import matrix from '../matrix/matrixService'
import MainScreens from './MainScreens'
import NewChatScreens from './NewChatScreens'

// const debug = require('debug')('ditto:services:navigation:RootNavigator')

const Stack = createStackNavigator()

export default function RootNavigator () {
  const authLoaded = useObservableState(auth.isLoaded$())
  const authLoggedIn = useObservableState(auth.isLoggedIn$())
  const matrixReady = useObservableState(matrix.isReady$())

  if (!authLoaded || (authLoggedIn && !matrixReady)) {
    return (
      <Stack.Navigator headerMode='none'>
        <Stack.Screen name='Splash' component={Splash} />
      </Stack.Navigator>
    )
  } else if (authLoggedIn) {
    return (
      <Stack.Navigator mode='modal' headerMode='none'>
        <Stack.Screen name='Main' component={MainScreens} />
        <Stack.Screen name='Settings' component={SettingsScreen} />
        <Stack.Screen name='NewChat' component={NewChatScreens} />
      </Stack.Navigator>
    )
  } else {
    return (
      <Stack.Navigator headerMode='none'>
        <Stack.Screen name='Landing' component={LandingScreen} />
        <Stack.Screen name='Login' component={LoginScreen} />
      </Stack.Navigator>
    )
  }
}

const Splash = () => (
  <Image source={require('../../assets/images/ditto-splash.png')} style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }} resizeMode='cover' />
)
