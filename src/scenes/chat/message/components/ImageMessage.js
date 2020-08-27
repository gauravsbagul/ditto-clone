import { useObservableState } from 'observable-hooks'
import React from 'react'
import styled from 'styled-components/native'

import { getNameColor } from '../../../../utilities'
import users from '../../../user/userService'
import BubbleWrapper from './BubbleWrapper'
import SenderText from './SenderText'

// const debug = require('debug')('ditto:scene:chat:message:components:ImageMessage')

const PlaceholderImage = require('../../../../assets/images/placeholder.png')

export default function ImageMessage ({ message, prevSame, nextSame }) {
  const myUser = users.getMyUser()
  const content = useObservableState(message.content$)
  const senderName = useObservableState(message.sender.name$)
  const status = useObservableState(message.status$)
  const isMe = myUser.id === message.sender.id

  return (
    <>
      <BubbleWrapper isMe={isMe} status={status}>
        <ImageWrapper
          nextSame={nextSame}
        >
          <StyledImage
            source={{ uri: content.thumb.url }}
            width={content.thumb.width}
            height={content.thumb.height}
            defaultSource={PlaceholderImage}
            isMe={isMe}
            nextSame={nextSame}
            prevSame={prevSame}
          />
        </ImageWrapper>
      </BubbleWrapper>

      {!prevSame && (
        <SenderText
          isMe={isMe}
          color={getNameColor(message.sender.id)}
        >
          {senderName}
        </SenderText>
      )}
    </>
  )
}

const sharpBorderRadius = 5
const ImageWrapper = styled.View`
  margin-top: 2;
  margin-bottom: ${({ nextSame }) => (nextSame ? 1 : 4)};
`

const StyledImage = styled.Image`
  height: ${({ height }) => height};
  width: ${({ width }) => width};
  border-radius: 20;

  ${({ isMe, prevSame, nextSame }) => isMe ? `
    ${prevSame ? `border-top-right-radius: ${sharpBorderRadius};` : ''}
    ${nextSame ? `border-bottom-right-radius: ${sharpBorderRadius};` : ''}
  ` : `
    ${prevSame ? `border-top-left-radius: ${sharpBorderRadius};` : ''}
    ${nextSame ? `border-bottom-left-radius: ${sharpBorderRadius};` : ''}
  `}
`
