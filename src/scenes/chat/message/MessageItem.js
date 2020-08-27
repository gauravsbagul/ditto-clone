import { Spinner } from '@ui-kitten/components'
import React from 'react'
import styled from 'styled-components/native'

import EventMessage from './components/EventMessage'
import ImageMessage from './components/ImageMessage'
import NoticeMessage from './components/NoticeMessage'
import TextMessage from './components/TextMessage'
import TypingIndicator from './components/TypingIndicator'
import Message from './Message'
import messages from './messageService'

// const debug = require('debug')('ditto:scenes:chat:message:MessageItem')

function isSameSender (messageA, messageB) {
  if (!messageA || !messageB ||
      !Message.isBubbleMessage(messageA) ||
      !Message.isBubbleMessage(messageB) ||
      messageA.sender.id !== messageB.sender.id) {
    return false
  }
  return true
}

export default function MessageItem ({ chatId, messageId, prevMessageId, nextMessageId, ...otherProps }) {
  if (messageId === 'loading') {
    return (
      <Loading />
    )
  }
  if (messageId === 'typing') {
    return (
      <TypingIndicator />
    )
  }

  const message = messages.getMessageById(messageId, chatId)
  const prevMessage = prevMessageId && prevMessageId !== 'loading'
    ? messages.getMessageById(prevMessageId, chatId)
    : null
  const nextMessage = nextMessageId && nextMessageId !== 'typing'
    ? messages.getMessageById(nextMessageId, chatId)
    : null
  const prevSame = isSameSender(message, prevMessage)
  const nextSame = isSameSender(message, nextMessage)
  const props = { ...otherProps, message, prevSame, nextSame }

  if (Message.isTextMessage(message.type)) {
    return (
      <TextMessage {...props} />
    )
  }
  if (Message.isImageMessage(message.type)) {
    return (
      <ImageMessage {...props} />
    )
  }
  if (Message.isNoticeMessage(message.type)) {
    return (
      <NoticeMessage {...props} />
    )
  }
  return (
    <EventMessage {...props} />
  )
}

const Loading = () => (
  <Row>
    <Spinner />
  </Row>
)

const Row = styled.View`
  flex-direction: row;
  justify-content: center;
  padding-top: 10;
`
