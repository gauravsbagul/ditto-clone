import React, { useCallback, useEffect, useState } from 'react'
import { FlatList, StyleSheet } from 'react-native'

import ChatListSwipeable from './ChatListSwipeable'

// const debug = require('debug')('ditto:scenes:home:components:ChatList')

export default function ChatList ({ chatList }) {
  const [swipeableRefs, setSwipeableRefs] = useState([])

  //* *******************************************************************************
  // Methods
  //* *******************************************************************************
  const recenterSwipeables = useCallback(() => {
    swipeableRefs.forEach((ref) => {
      if (ref?.state?.rowState === 1) {
        ref.close()
      }
    })
  }, [swipeableRefs])

  //* *******************************************************************************
  // Lifecycle
  //* *******************************************************************************
  useEffect(() => {
    setSwipeableRefs(Array(chatList.length).fill(null))
  }, [chatList])

  return (
    <FlatList
      onScroll={recenterSwipeables}
      style={styles.list}
      data={chatList}
      renderItem={({ item, index }) => (
        <ChatListSwipeable
          chat={item}
          onAction={recenterSwipeables}
          getRef={ref => { swipeableRefs[index] = ref }}
        />
      )}
    />
  )
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: 'transparent'
  }
})
