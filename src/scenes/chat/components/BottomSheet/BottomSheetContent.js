import { Layout, useTheme } from '@ui-kitten/components'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import AddEmojiIcon from '../../../../assets/icons/icon-add-emoji.svg'
import { SCREEN_WIDTH } from '../../../../constants'
import { isIos } from '../../../../utilities'

const quickEmojis = ['♥️', '👍🏼', '😊', '😂', '😍']

export default function BottomSheetContent ({ onEmojiSelected, onOpenEmojiPicker }) {
  const theme = useTheme()

  return (
    <Layout level='2' style={{ height: 1000, alignItems: 'center' }}>
      <View style={styles(theme).emojiRow}>
        {quickEmojis.map(emojiKey => (
          <EmojiButton key={emojiKey} onPress={onEmojiSelected} emoji={emojiKey} />
        ))}
        <MoreEmojisButton onPress={onOpenEmojiPicker} />
      </View>
    </Layout>
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
          marginTop: !isIos() ? -8 : null
        }, isIos() ? {} : { fontFamily: 'NotoColorEmoji' }]}
      >
        {emoji}
      </Text>
    </TouchableOpacity>
  )
}

function MoreEmojisButton ({ onPress }) {
  const theme = useTheme()

  return (
    <TouchableOpacity style={styles(theme).emojiButton} onPress={onPress}>
      <AddEmojiIcon
        height={Math.min(SCREEN_WIDTH / 12, 40)}
        width={Math.min(SCREEN_WIDTH / 12, 40)}
        fill={theme['color-basic-400']}
      />
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
