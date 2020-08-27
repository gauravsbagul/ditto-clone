import { Input, Layout, Spinner, Text as ThemedText } from '@ui-kitten/components'
import { NimbleEmojiIndex } from 'emoji-mart-native'
import emojiData from 'emoji-mart-native/data/all.json'
import React, { useEffect, useState } from 'react'
import { ScrollView, Text, TouchableOpacity } from 'react-native'

import { getEmojis, isIos } from '../../../../utilities'

const emojiIndex = new NimbleEmojiIndex(emojiData, isIos() ? 'apple' : 'google')
const emojis = getEmojis(emojiIndex)

export default function EmojiSheetContent ({ onEmojiSelected }) {
  const [isLoading, setLoading] = useState(true)
  const [emojiSearchValue, setEmojiSearchValue] = useState('')
  const [emojiList, setEmojiList] = useState([])

  useEffect(() => {
    setLoading(true)
    if (emojiSearchValue.length > 0) {
      setEmojiList(emojiIndex.search(emojiSearchValue))
    } else {
      setEmojiList(emojis)
    }
    setLoading(false)
  }, [emojiSearchValue])

  return (
    <Layout level='2' style={{ height: 1000, alignItems: 'center', paddingHorizontal: 12 }}>
      <Input
        style={{ marginBottom: 12 }}
        placeholder='Search emoji...'
        value={emojiSearchValue}
        onChangeText={setEmojiSearchValue}
        selectTextOnFocus
      />
      {emojiList.length > 0 ? (
        <ScrollView
          contentContainerStyle={{
            width: '100%',
            flexDirection: 'row',
            flexWrap: 'wrap',
            paddingTop: 20
          }}
        >
          {emojiList.map((emoji) => (
            <TouchableOpacity
              key={emoji.id}
              onPress={() => onEmojiSelected(emoji.native)}
              style={{
                width: 80
              }}
            >
              <Text
                style={[{
                  fontSize: 35,
                  margin: 15,
                  marginTop: !isIos() ? -8 : null
                }, isIos() ? {} : { fontFamily: 'NotoColorEmoji' }]}
              >
                {emoji.native}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : !isLoading ? (
        <ThemedText appearance='hint'>Sorry, no emoji corresponding to this search</ThemedText>
      ) : (
        <Spinner />
      )}

    </Layout>
  )
}
