import { useTheme } from '@ui-kitten/components'
import Color from 'color'
import { useObservableState } from 'observable-hooks'
import React from 'react'
import styled from 'styled-components/native'

import { getNameColor, isEmoji, isIos } from '../../../../utilities'
import users from '../../../user/userService'
import BubbleWrapper from './BubbleWrapper'
import Html from './Html'
import Reactions from './Reactions'
import SenderText from './SenderText'

// const debug = require('debug')('ditto:scene:chat:message:components:TextMessage')

export default function TextMessage ({ message, prevSame, nextSame, onLongPress }) {
  const theme = useTheme()
  const myUser = users.getMyUser()
  const content = useObservableState(message.content$)
  const senderName = useObservableState(message.sender.name$)
  const status = useObservableState(message.status$)
  const reactions = useObservableState(message.reactions$)
  const props = { prevSame, nextSame }
  const isMe = myUser.id === message.sender.id

  //* *******************************************************************************
  // Methods
  //* *******************************************************************************
  const toggleReaction = (key) => {
    message.toggleReaction(key)
  }

  const _onLongPress = () => onLongPress(message)

  //* *******************************************************************************
  // Lifecycle
  //* *******************************************************************************
  return (
    <>
      <BubbleWrapper isMe={isMe} status={status}>
        {isEmoji(content.text) ? (
          <Emoji
            style={!isIos() ? { fontFamily: 'NotoColorEmoji' } : {}}
            {...props}
          >
            {content.text}
          </Emoji>
        ) : (
          <Bubble
            {...props}
            isMe={isMe}
            underlayColor={isMe ? theme['color-primary-700'] : Color(theme['background-basic-color-2']).darken(0.2).hex()}
            onLongPress={_onLongPress}
            delayLongPress={200}
            style={[
              { backgroundColor: isMe ? theme['color-primary-active'] : theme['background-basic-color-2'] },
              reactions ? { marginBottom: 18 } : {}
            ]}
          >
            <>
              <Html html={content.html} />
              {reactions && (
                <Reactions
                  reactions={reactions}
                  toggleReaction={toggleReaction}
                  myUserId={myUser.id}
                  isMyBubble={isMe}
                />
              )}
            </>
          </Bubble>
        )}
      </BubbleWrapper>

      {!prevSame && (
        <SenderText isMe={isMe} color={getNameColor(message.sender.id)}>
          {senderName}
        </SenderText>
      )}
    </>
  )
}

const Emoji = styled.Text`
  font-size: 45;
  margin-left: 18;
  margin-right: 8;
  margin-top: ${isIos() ? '4' : '-7'};
  margin-bottom: 4;
`

const sharpBorderRadius = 5

const Bubble = styled.TouchableHighlight`
  padding-left: 14;
  padding-right: 14;
  padding-top: 8;
  padding-bottom: 8;

  margin-top: 2;
  margin-bottom: ${({ nextSame }) => (nextSame ? 1 : 4)};

  border-radius: 18;

  ${({ isMe, prevSame, nextSame }) => isMe ? `
    ${prevSame ? `border-top-right-radius: ${sharpBorderRadius};` : ''}
    ${nextSame ? `border-bottom-right-radius: ${sharpBorderRadius};` : ''}
  ` : `
    ${prevSame ? `border-top-left-radius: ${sharpBorderRadius};` : ''}
    ${nextSame ? `border-bottom-left-radius: ${sharpBorderRadius};` : ''}
  `}
`
