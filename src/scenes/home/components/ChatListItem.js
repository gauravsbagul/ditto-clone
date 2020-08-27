import { Avatar, Text, useTheme } from '@ui-kitten/components'
import Color from 'color'
import moment from 'moment'
import { useObservableState } from 'observable-hooks'
import React from 'react'
import { View } from 'react-native'
import styled from 'styled-components/native'

import ReadByMeIcon from '../../../assets/icons/icon-mail-close.svg'
import ReadByAllIcon from '../../../assets/icons/icon-mail-open.svg'
import { getNameColor } from '../../../utilities'
import ChatSummary from './ChatSummary'

// const debug = require('debug')('ditto:scenes:home:components:ChatListItem')

const avatarSize = 56
const Placeholder = require('../../../assets/images/placeholder.png')

export default function ChatListItem ({ onLongPress, onPress, chat }) {
  const theme = useTheme()
  const name = useObservableState(chat.name$)
  const avatar = useObservableState(chat.avatar$)
  const snippet = useObservableState(chat.snippet$)
  const readState = useObservableState(chat.readState$)
  const isDirect = useObservableState(chat.isDirect$)

  return (
    <Item
      delayLongPress={200}
      onLongPress={onLongPress}
      onPress={onPress}
      style={readState === 'unread' ? { backgroundColor: theme['background-basic-color-3'] } : {}}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {avatar ? (
          <Avatar size='giant' source={{ uri: chat.getAvatarUrl(avatarSize) }} defaultSource={Placeholder} />
        ) : (
          <View
            style={{
              position: 'relative',
              width: avatarSize,
              height: avatarSize
            }}
            shouldRasterizeIOS
          >
            <AvatarTextWrapper>
              <Text category='h5'>{name[0].toUpperCase()}</Text>
            </AvatarTextWrapper>
            <AvatarBackground roomName={name} />
          </View>
        )}

        <ChatSummary name={name} snippet={snippet.content} readState={readState} />
      </View>

      <ItemAccessory>
        <Text
          category='c1'
          appearance='hint'
          numberOfLines={1}
          style={{ marginBottom: 4 }}
        >
          {moment(snippet.timestamp).fromNow()}
        </Text>
        <ReadIndicator readState={readState} isDirect={isDirect} />
      </ItemAccessory>
    </Item>
  )
}

function ReadIndicator ({ readState, isDirect }) {
  const theme = useTheme()

  if (readState === 'unread') {
    return (
      <View
        style={{
          width: 18,
          height: 18,
          backgroundColor: theme['color-primary-active'],
          borderRadius: 50
        }}
      />
    )
  }
  if (!isDirect) return null
  if (readState === 'readByAll') {
    return <ReadByAllIcon fill={theme['color-basic-800']} width={20} height={20} />
  } else {
    return <ReadByMeIcon fill={theme['color-basic-800']} width={20} height={20} />
  }
}

const Item = styled.TouchableOpacity`
  padding-left: 14;
  padding-right: 14;
  padding-top: 8;
  padding-bottom: 8;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.4;
  margin-bottom: 0.4;
`

const AvatarTextWrapper = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  height: ${avatarSize};
  width: ${avatarSize};
  justify-content: center;
  align-items: center;
  z-index: 2;
`

const AvatarBackground = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  height: ${avatarSize};
  width: ${avatarSize};
  border-radius: 40;
  background-color: ${({ roomName }) =>
    Color(getNameColor(roomName))
      .darken(0.5)
      .hex()};
  z-index: 1;
`

const ItemAccessory = styled.View`
align-items: flex-end
`
