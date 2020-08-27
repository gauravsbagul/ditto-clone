import { Layout } from '@ui-kitten/components'
import React from 'react'
import { StyleSheet, View } from 'react-native'

export default function BottomSheetHeader ({ emojiSearchValue = '', setEmojiSearchValue = () => {}, setSearchResults = () => {} }) {
  return (
    <Layout level='2' style={styles.layout}>
      <View style={styles.handle} />
    </Layout>
  )
}

const styles = StyleSheet.create({
  layout: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingBottom: 12
  },
  handle: {
    borderRadius: 12,
    backgroundColor: 'gray',
    width: 50,
    height: 6,
    marginTop: 8
  }
})
