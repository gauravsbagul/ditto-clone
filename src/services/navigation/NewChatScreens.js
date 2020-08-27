import { createStackNavigator } from '@react-navigation/stack'
import * as React from 'react'

import NewChatDetailsScreen from '../../scenes/newChat/NewChatDetailsScreen'
import NewChatSearchScreen from '../../scenes/newChat/NewChatSearchScreen'

const Stack = createStackNavigator()

export default function NewChatScreens () {
  return (
    <Stack.Navigator headerMode='none'>
      <Stack.Screen
        name='NewChatSearch'
        component={NewChatSearchScreen}
      />
      <Stack.Screen
        name='NewChatDetails'
        component={NewChatDetailsScreen}
      />
    </Stack.Navigator>
  )
}
