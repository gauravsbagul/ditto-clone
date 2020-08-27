import { Icon, Spinner, useTheme } from '@ui-kitten/components'
import React from 'react'
import styled from 'styled-components/native'

import { MessageStatus } from '../Message'

// const debug = require('debug')('ditto:scene:chat:message:components:BubbleWrapper')

export default function BubbleWrapper ({ children, isMe, status }) {
  return (
    <Wrapper isMe={isMe}>
      {children}
      <BubbleInfo>
        <StatusIcon status={status} />
      </BubbleInfo>
    </Wrapper>
  )
}

const StatusIcon = ({ status }) => {
  const theme = useTheme()

  if (status === MessageStatus.NOT_SENT || status === MessageStatus.NOT_UPLOADED) {
    return (
      <Icon
        name='alert-triangle'
        width={22}
        height={22}
        fill={theme['text-danger-color']}
      />
    )
  } else if (status) {
    return (
      <Spinner size='small' />
    )
  } else {
    return null
  }
}

const Wrapper = styled.View`
  flex-direction: ${({ isMe }) => isMe ? 'row-reverse' : 'row'};
  margin-left: 13;
  margin-right: 10%;
`

const BubbleInfo = styled.View`
  justify-content: center;
  width: 30;
`
