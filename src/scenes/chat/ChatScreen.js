import { Icon, TopNavigation, useTheme } from '@ui-kitten/components'
import { useObservableState } from 'observable-hooks'
import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView, View } from 'react-native'
import ImagePicker from 'react-native-image-picker'
import Touchable from 'react-native-platform-touchable'
import { useSafeArea } from 'react-native-safe-area-context'

import { isIos } from '../../utilities'
import chats from './chatService'
import Composer from './components/Composer'
import MessageOptionsSheet from './components/MessageOptionsSheet'
import Timeline from './components/Timeline'

const debug = require('debug')('ditto:scenes:chat:ChatScreen')

export default function ChatScreen ({ navigation, route }) {
  const [messageOptionsSheetVisible, setMessageOptionsSheetVisible] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const theme = useTheme()
  const insets = useSafeArea()
  const [chat, setChat] = useState(chats.getChatById(route.params.chatId))
  const chatName = useObservableState(chat.name$)

  //* *******************************************************************************
  // Methods
  //* *******************************************************************************
  const onType = typing => {
    chat.setTyping(typing)
  }

  const onSend = messageText => {
    chat.sendMessage(messageText, 'm.text')
  }

  const handleImagePick = () => {
    try {
      ImagePicker.showImagePicker(async response => {
        if (response.didCancel) return

        chat.sendMessage(response, 'm.image')
      })
    } catch (e) {
      debug('onImagePick error', e)
    }
  }

  const onMessageLongPress = (message) => {
    setMessageOptionsSheetVisible(true)
    setSelectedMessage(message)
  }

  const onOptionsSheetClose = () => {
    setSelectedMessage(null)
  }

  const renderBackButton = () => (
    <Touchable onPress={() => navigation.goBack()}>
      <Icon name={`arrow-${isIos() ? 'ios-' : ''}back`} width={35} height={35} fill={theme['text-basic-color']} />
    </Touchable>
  )

  //* *******************************************************************************
  // Lifecycle
  //* *******************************************************************************
  useEffect(() => {
    if (!route.params.chatId) {
      debug('No chat ID, leaving Chat…')
      navigation.navigate('Home')
    }
    if (chat.id !== route.params.chatId) {
      debug('ChatId', route.params.chatId)
      setChat(chats.getChatById(route.params.chatId))
    }
  }, [chat.id, navigation, route.params.chatId])

  return (
    <>
      <View style={{ height: insets.top, backgroundColor: theme['background-basic-color-2'] }} />
      <TopNavigation
        title={chatName || route.params.chatName || '...'}
        alignment='center'
        leftControl={renderBackButton()}
        style={{ backgroundColor: theme['background-basic-color-2'] }}
      />
      <Wrapper style={{ flex: 1, backgroundColor: theme['background-basic-color-4'] }}>
        <Timeline chat={chat} onMessageLongPress={onMessageLongPress} />
        <Composer
          onType={onType}
          onSend={onSend}
          onImagePick={handleImagePick}
        />
        <MessageOptionsSheet visible={messageOptionsSheetVisible} setVisible={setMessageOptionsSheetVisible} selectedMessage={selectedMessage} onClose={onOptionsSheetClose} />
      </Wrapper>
    </>
  )
}

const Wrapper = ({ style, children }) => {
  return isIos() ? (
    <KeyboardAvoidingView style={style} behavior='padding'>
      {children}
    </KeyboardAvoidingView>
  ) : (
    <View style={style}>{children}</View>
  )
}
