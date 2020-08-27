import { Avatar, Text } from '@ui-kitten/components'
import Color from 'color'
import React from 'react'
import { View } from 'react-native'
import Touchable from 'react-native-platform-touchable'
import styled from 'styled-components/native'

import { SCREEN_WIDTH } from '../../../constants'
import { getNameColor } from '../../../utilities'
import users from '../../user/userService'

// const debug = require('debug')('ditto:scenes:newChat:components:ChipInputListItem')

const avatarSize = 56

export default function ChipInputListItem ({ id, onPress, item }) {
  return (
    <Item onPress={onPress}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {item.avatar ? (
          <Avatar size='giant' source={{ uri: users.getAvatarUrl(item.avatar) }} />
        ) : (
          <View
            style={{
              position: 'relative',
              width: avatarSize,
              height: avatarSize
            }}
          >
            <AvatarTextWrapper>
              <Text category='h5'>{item.name ? item.name[0].toUpperCase() : id[1].toUpperCase()}</Text>
            </AvatarTextWrapper>
            <AvatarBackground roomName={item.name || id} />
          </View>
        )}

        <ChatTitle>
          <Text category='p1' numberOfLines={1}>{item.name}</Text>
          <Text appearance='hint' category='p2' numberOfLines={1}>{id}</Text>
        </ChatTitle>
      </View>
    </Item>
  )
}

const Item = styled(Touchable)`
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

const ChatTitle = styled.View`
  max-width: ${SCREEN_WIDTH * 0.6};
  margin-left: 14;
`
