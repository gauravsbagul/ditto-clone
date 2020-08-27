import { Text, useTheme } from '@ui-kitten/components'
import { useObservableState } from 'observable-hooks'
import React from 'react'
import Html from 'react-native-render-html'
import styled from 'styled-components/native'

import { COLORS } from '../../../../constants'

export default function NoticeMessage ({ message }) {
  const theme = useTheme()
  const content = useObservableState(message.content$)
  const senderName = useObservableState(message.sender.name$)

  return (
    <Wrapper>
      <Text appearance='hint' category='c1'>{senderName}</Text>
      <Bubble style={{ backgroundColor: theme['background-basic-color-3'] }}>
        <Html html={content.html} {...htmlProps} />
      </Bubble>
    </Wrapper>
  )
}

const baseFontStyle = {
  color: '#fff',
  fontSize: 13,
  letterSpacing: 0.3,
  fontWeight: '400',
  textAlign: 'center'
}

const tagsStyles = {
  blockquote: {
    borderLeftColor: COLORS.red,
    borderLeftWidth: 3,
    paddingLeft: 10,
    marginVertical: 10,
    opacity: 0.8
  },
  p: {}
}

const htmlProps = {
  baseFontStyle,
  tagsStyles
}

const Wrapper = styled.View`
  align-items: center;
  justify-content: center;
  margin-top: 12;
  margin-bottom: 12;
`

const Bubble = styled.View`
  padding-top: 8;
  padding-bottom: 8;
  padding-left: 14;
  padding-right: 14;
  border-radius: 16;
  margin-top: 4;
  max-width: 300;
`
