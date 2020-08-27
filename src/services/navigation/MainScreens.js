import { useNavigation } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { Avatar, Icon, Text, TopNavigation, useTheme } from '@ui-kitten/components'
import { useObservableState } from 'observable-hooks'
import React from 'react'
import { SafeAreaView } from 'react-native'
import Touchable from 'react-native-platform-touchable'

import ChatScreen from '../../scenes/chat/ChatScreen'
import users from '../../scenes/user/userService'
import { isIos } from '../../utilities'
import HomeScreens from './HomeScreens'

// const debug = require('debug')('ditto:services:navigation:MainNavigator')

const Stack = createStackNavigator()

export default function MainScreens () {
  return (
    <Stack.Navigator headerMode='screen'>
      <Stack.Screen
        name='Home'
        options={{ header: HomeHeader }}
        component={HomeScreens}
      />
      <Stack.Screen
        name='Chat'
        options={{ headerShown: false }}
        component={ChatScreen}
      />
    </Stack.Navigator>
  )
}

function HeaderLeft () {
  const { navigate } = useNavigation()
  const user = users.getMyUser()
  const name = useObservableState(user.name$)
  const avatar = useObservableState(user.avatar$)

  return (
    <Touchable onPress={() => navigate('Settings')} style={{ flexDirection: 'row', alignItems: 'center' }}>
      <>
        <Avatar
          source={{ uri: avatar ? users.getAvatarUrl(avatar) : null }}
          style={{ marginLeft: 6, marginRight: 12, width: 45, height: 45 }}
          defaultSource={require('../../assets/images/placeholder.png')}
        />
        <Text category='h6'>{name}</Text>
      </>
    </Touchable>
  )
}

function HeaderRight () {
  const { navigate } = useNavigation()
  const theme = useTheme()

  return isIos() ? (
    <Touchable
      onPress={() => navigate('NewChat')}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme['color-primary-active'],
        padding: 4,
        borderRadius: 50,
        marginRight: 6
      }}
    >
      <Icon name='plus' width={20} height={20} fill={theme['text-basic-color']} />
    </Touchable>
  ) : null
}

function HomeHeader () {
  const theme = useTheme()

  return (
    <SafeAreaView style={{ backgroundColor: theme['background-basic-color-2'] }}>
      <TopNavigation
        style={{ backgroundColor: theme['background-basic-color-2'] }}
        leftControl={<HeaderLeft />}
        rightControls={<HeaderRight />}
        alignment='start'
      />
    </SafeAreaView>
  )
}
