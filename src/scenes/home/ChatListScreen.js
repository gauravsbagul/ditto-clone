import {
  Icon,
  Layout,
  useTheme
} from '@ui-kitten/components'
import { useObservableState } from 'observable-hooks'
import React from 'react'
import { useTranslation } from 'react-i18next'
import FAB from 'react-native-fab'
import styled from 'styled-components/native'

import matrix from '../../services/matrix/matrixService'
import { isIos } from '../../utilities'
import chats from '../chat/chatService'
import ChatList from './components/ChatList'

// const debug = require('debug')('ditto:scenes:home:components:ChatList')

export default function ChatListScreen ({ type, navigation }) {
  const chatList = useObservableState(chats.getListByType$(type))
  const isSynced = useObservableState(matrix.isSynced$())

  const theme = useTheme()

  const { t } = useTranslation('home')

  const openNewChat = () => {
    navigation.navigate('NewChat')
  }

  return (
    <Layout level='4' style={{ height: '100%' }}>
      {!isSynced && (
        <SyncingIndicator>
          <SyncingText>{t('banner.syncing')}</SyncingText>
        </SyncingIndicator>
      )}
      <ChatList
        chatList={chatList}
      />

      {!isIos() && (
        // eslint-disable-next-line react/jsx-pascal-case
        <FAB
          buttonColor={theme['color-primary-active']}
          iconTextColor={theme['text-basic-color']}
          onClickAction={openNewChat}
          visible
          iconTextComponent={<PlusIcon />}
        />
      )}
    </Layout>
  )
}

const PlusIcon = () => {
  const theme = useTheme()

  return (
    <Icon
      name='plus'
      style={{ width: 24, height: 24 }}
      fill={theme['text-basic-color']}
    />
  )
}

const SyncingIndicator = styled.View`
  background-color: #4e22be;
  height: 20;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const SyncingText = styled.Text`
  color: #fff;
  font-style: italic;
  font-size: 12;
`
