import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native'
import BottomSheet from 'reanimated-bottom-sheet'

import { SCREEN_HEIGHT } from '../../../../constants'
import messages from '../../message/messageService'
import BottomSheetContent from './BottomSheetContent'
import BottomSheetHeader from './BottomSheetHeader'
import EmojiSheetContent from './EmojiSheetContent'

// const debug = require('debug')('ditto:scenes:chat:components:BottomSheetModal')

export default function BottomSheetModal ({ navigation, route }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState(null)

  const defaultSheetRef = useRef()

  const onOpenEmojiPicker = () => {
    defaultSheetRef.current.snapTo(0)
    defaultSheetRef.current.snapTo(0)
    setShowEmojiPicker(true)
  }

  const onEmojiSelected = (emoji) => {
    selectedMessage.toggleReaction(emoji)
    navigation.goBack(null)
  }

  const renderBottomSheetContent = () => {
    if (showEmojiPicker) {
      return <EmojiSheetContent onEmojiSelected={onEmojiSelected} />
    } else {
      return <BottomSheetContent onEmojiSelected={onEmojiSelected} onOpenEmojiPicker={onOpenEmojiPicker} />
    }
  }

  const renderBottomSheetHeader = () => {
    return <BottomSheetHeader />
  }

  const closeModal = () => {
    navigation.goBack()
  }

  useEffect(() => {
    defaultSheetRef.current.snapTo(1)
    defaultSheetRef.current.snapTo(1)
  }, [])

  useEffect(() => {
    const message = route.params.selectedMessage
    setSelectedMessage(messages.getMessageById(message.id, message.roomId))
  }, [route.params.selectedMessage])

  return (
    <View style={{ height: SCREEN_HEIGHT }}>
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <BottomSheet
        ref={defaultSheetRef}
        snapPoints={['80%', 200, 0]}
        initialSnap={2}
        renderContent={renderBottomSheetContent}
        renderHeader={renderBottomSheetHeader}
        onCloseEnd={closeModal}
        enabledContentGestureInteraction={false}
        // enabledBottomInitialAnimation
      />
    </View>
  )
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: '#00000070',
    flex: 1
  }
})
