import { useTheme } from '@ui-kitten/components'
import LottieView from 'lottie-react-native'
import React from 'react'
import styled from 'styled-components/native'

// const debug = require('debug')('ditto:scenes:chat:message:components:TypingIndicator')

export default function TypingIndicator () {
  const theme = useTheme()

  return (
    <TypingBubble style={{ backgroundColor: theme['background-basic-color-3'] }}>
      <LottieView
        source={require('../../../../assets/animations/typing.json')}
        autoPlay
        loop
        style={{ width: 40, marginBottom: -4, marginTop: -1 }}
      />
    </TypingBubble>
  )
}

const TypingBubble = styled.View`
  border-radius: 18;
  width: 56;
  padding-left: 8;
  padding-right: 8;
  margin-top: 2;
  margin-bottom: 4;
  margin-left: 8;
  margin-right: 8;

`
