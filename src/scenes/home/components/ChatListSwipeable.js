import { useNavigation } from '@react-navigation/native'
import {
  Button,
  Icon,
  StyleService,
  useStyleSheet
} from '@ui-kitten/components'
import React, { useCallback, useState } from 'react'
import { Alert, Animated, InteractionManager } from 'react-native'
import Swipeable from 'react-native-gesture-handler/Swipeable'

import ChatListItem from './ChatListItem'

const debug = require('debug')('ditto:scenes:home:components:ChatListSwipeable')

export default function ChatListSwipeable ({ chat, getRef, onAction }) {
  const { navigate } = useNavigation()
  const styles = useStyleSheet(themedStyles)
  const [swipeable, setSwipeable] = useState(null)

  //* *******************************************************************************
  // Methods
  //* *******************************************************************************
  const updateRef = useCallback((node) => {
    getRef(node)
    setSwipeable(node)
  }, [getRef])

  const renderLeftActions = (progress, dragX) => {
    const trans = dragX.interpolate({
      inputRange: [0, 40, 60, 80],
      outputRange: [-50, 0, 0, 0]
    })

    const confirmLeaveChat = () => {
      Alert.alert(
        'Leave Chat',
        `Are you sure you would like to leave "${chat.name$.getValue()}"?`,
        [
          {
            text: 'Stay',
            onPress: () => {}
          },
          {
            text: 'Leave',
            onPress: reallyLeaveChat,
            style: 'destructive'
          }
        ],
        { cancelable: false }
      )
    }

    const reallyLeaveChat = async () => {
      try {
        await chat.leave()
      } catch (e) {
        debug('leaveRoom error', e)
      }
    }

    return (
      <Animated.View
        style={[{ transform: [{ translateX: trans }] }, styles.leftActionsView]}
      >
        <Button
          onPress={confirmLeaveChat}
          appearance='filled'
          style={styles.leftActionsButton}
          icon={TrashIcon}
        />
      </Animated.View>
    )
  }

  const onLongPress = () => {
    onAction()
    swipeable.openLeft()
  }

  const navigateToChat = () => {
    InteractionManager.runAfterInteractions(() => {
      onAction()
      navigate('Chat', {
        chatId: chat.id,
        chatName: chat.name$.getValue()
      })
    })
  }

  //* *******************************************************************************
  // Lifecycle
  //* *******************************************************************************
  return (
    <Swipeable
      enabled={false}
      ref={updateRef}
      renderLeftActions={renderLeftActions}
      leftThreshold={100}
      overshootFriction={8}
    >
      <ChatListItem
        onLongPress={onLongPress}
        onPress={navigateToChat}
        chat={chat}
      />
    </Swipeable>
  )
}

const themedStyles = StyleService.create({
  leftActionsView: {
    height: '100%',
    justifyContent: 'center',
    marginLeft: 12
  },
  leftActionsButton: {
    borderWidth: 0,
    backgroundColor: 'background-basic-color-1',
    width: 25,
    height: 25,
    marginRight: 3,
    borderRadius: 50,
    alignSelf: 'flex-end',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

const TrashIcon = (style) => (
  <Icon {...style} name='trash' width={20} height={20} />
)
