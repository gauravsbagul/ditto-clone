import {
  Button,
  Icon,
  Input,
  Layout,
  ListItem,
  Toggle,
  TopNavigation,
  TopNavigationAction,
  useTheme
} from '@ui-kitten/components'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SafeAreaView } from 'react-native'

import chats from '../chat/chatService'

const debug = require('debug')('ditto:scenes:newChat:NewChatDetailsScreen')

export default function NewChatDetailsScreen ({ navigation, route }) {
  const [isPrivate, setIsPrivate] = useState(true)
  const [roomName, setRoomName] = useState('')

  const theme = useTheme()

  const { t } = useTranslation('newChat')

  const handleCreateChat = async () => {
    const { usersToInvite } = route.params

    const options = {
      visibility: isPrivate ? 'private' : 'public',
      invite: usersToInvite,
      name: roomName,
      room_topic: ''
    }
    debug('Room options: ', options)
    const chat = await chats.createChat(options)
    debug('Chat created', chat)
    if (chat) {
      navigation.navigate('Chat', { chatId: chat.id, chatName: chat.name })
    }
  }

  const goBack = () => navigation.goBack()
  const close = () => navigation.navigate('Home')

  return (
    <SafeAreaView style={{ backgroundColor: theme['background-basic-color-2'] }}>
      <TopNavigation
        title={t('details.title')}
        alignment='center'
        leftControl={BackAction(goBack)}
        rightControls={CloseAction(close)}
        style={{ backgroundColor: theme['background-basic-color-2'] }}
        titleStyle={{ fontSize: 18 }}
      />
      <Layout level='4' style={{ height: '100%', paddingTop: 24 }}>

        <Input
          label={t('details.chatNameInputLabel')}
          value={roomName}
          onChangeText={setRoomName}
          placeholder={t('details.chatNameInputPlaceholder')}
          style={{ marginHorizontal: 12, marginBottom: 18 }}
        />

        <ListItem
          title={t('details.privateTitle')}
          description={t('details.privateDescription')}
          style={{ backgroundColor: theme['background-basic-color-3'] }}
          accessory={() => (
            <Toggle
              onChange={setIsPrivate}
              checked={isPrivate}
            />
          )}
        />

        <Button onPress={handleCreateChat} style={{ marginHorizontal: 12, marginTop: 24 }}>
          {t('details.createChatButtonLabel')}
        </Button>
      </Layout>
    </SafeAreaView>
  )
}

const BackAction = (onBack) => (
  <TopNavigationAction
    onPress={onBack}
    icon={BackIcon}
  />
)

const BackIcon = (style) => (
  <Icon {...style} name='arrow-back' width={30} height={30} />
)

const CloseAction = (onClose) => (
  <TopNavigationAction
    onPress={onClose}
    icon={CloseIcon}
  />
)

const CloseIcon = (style) => (
  <Icon {...style} name='close' width={30} height={30} />
)
