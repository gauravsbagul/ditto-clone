import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import { useTheme } from '@ui-kitten/components'
import React from 'react'
import { useTranslation } from 'react-i18next'

import GroupsSvgIcon from '../../assets/icons/icon-groups.svg'
import MessagesSvgIcon from '../../assets/icons/icon-messages.svg'
import ChatListScreen from '../../scenes/home/ChatListScreen'
import { isIphoneX } from '../../utilities'

// const debug = require('debug')('ditto:scenes:home:HomeScreens')

const Tab = createMaterialTopTabNavigator()

const options = (theme) => {
  return {
    tabBarPosition: 'bottom',
    tabBarOptions: {
      showIcon: true,
      activeTintColor: theme['text-basic-color'],
      inactiveTintColor: theme['text-hint-color'],
      style: {
        backgroundColor: theme['background-basic-color-2'],
        paddingLeft: 40,
        paddingRight: 40,
        height: isIphoneX() ? 75 : 60
      },
      indicatorStyle: {
        height: 0
      },
      tabStyle: {
        alignSelf: 'center',
        padding: 0
      },
      labelStyle: {
        fontWeight: '700',
        fontSize: 10
      },
      iconStyle: {
        marginTop: 5
      }
    }

  }
}

export default function HomeScreens () {
  const theme = useTheme()
  const { t } = useTranslation('home')

  return (
    <Tab.Navigator {...options(theme)}>
      <Tab.Screen name='Messages' options={{ tabBarIcon: MessagesIcon, tabBarLabel: t('tab.messages') }} component={DirectChatList} />
      <Tab.Screen name='Groups' options={{ tabBarIcon: GroupsIcon, tabBarLabel: t('tab.groups') }} component={GroupChatList} />
    </Tab.Navigator>
  )
}

const DirectChatList = (props) => (<ChatListScreen {...props} type='direct' />)
const GroupChatList = (props) => (<ChatListScreen {...props} type='group' />)

const MessagesIcon = ({ color }) => <MessagesSvgIcon style={{ marginTop: 2 }} width={28} height={28} fill={color} />
const GroupsIcon = ({ color }) => <GroupsSvgIcon width={25} height={25} fill={color} />
