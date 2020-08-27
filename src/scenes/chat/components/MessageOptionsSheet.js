import { Layout, Text, useTheme } from '@ui-kitten/components'
import React, { useEffect } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'

import { SCREEN_WIDTH } from '../../../constants'
import DittoBottomSheet from '../../../shared/components/DittoBottomSheet'
import { isIos } from '../../../utilities'

const quickEmojis = ['♥️', '👍🏼', '😊', '😂', '😡', '🎉']

export default function MessageOptionsSheet ({ visible, setVisible, selectedMessage, onClose }) {
  const theme = useTheme()

  const handleOnClose = () => {
    setVisible(false)
    onClose()
  }

  const onEmojiSelected = (emoji) => {
    selectedMessage.toggleReaction(emoji)
    setVisible(false)
  }

  useEffect(() => {
    if (selectedMessage) {
      setVisible(true)
    } else {
      setVisible(false)
    }
  }, [selectedMessage, setVisible])

  return (
    <DittoBottomSheet visible={visible} gestureEnabled={false} innerScrollEnabled={false} onClose={handleOnClose} style={{ backgroundColor: theme['background-basic-color-2'] }}>
      <Layout level='2' style={{ alignItems: 'center', paddingTop: 24, paddingBottom: 48 }}>
        <View style={styles(theme).emojiRow}>
          {quickEmojis.map(emojiKey => (
            <EmojiButton key={emojiKey} onPress={onEmojiSelected} emoji={emojiKey} />
          ))}
          {/* <MoreEmojisButton onPress={onOpenEmojiPicker} /> */}
        </View>
      </Layout>
    </DittoBottomSheet>
  )
}

function EmojiButton ({ emoji = '', onPress }) {
  const theme = useTheme()
  const selectEmoji = () => {
    onPress(emoji)
  }
  return (
    <TouchableOpacity style={styles(theme).emojiButton} onPress={selectEmoji}>
      <Text
        style={[{
          fontSize: Math.min(SCREEN_WIDTH / 14, 30),
          marginTop: !isIos() ? -2 : null
        }, isIos() ? { lineHeight: 0 } : { fontFamily: 'NotoColorEmoji', lineHeight: Math.min(SCREEN_WIDTH / 8, 65) }]}
      >
        {emoji}
      </Text>
    </TouchableOpacity>
  )
}

const styles = theme => StyleSheet.create({
  emojiRow: {
    flexDirection: 'row',
    marginLeft: -12
  },
  emojiButton: {
    backgroundColor: theme['background-basic-color-1'],
    borderRadius: 50,
    width: Math.min(SCREEN_WIDTH / 8, 65),
    height: Math.min(SCREEN_WIDTH / 8, 65),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12
  }
})
