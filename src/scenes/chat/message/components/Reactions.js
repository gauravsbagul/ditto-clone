import { Text, useTheme } from '@ui-kitten/components'
import React from 'react'
import styled from 'styled-components/native'

import { isIos } from '../../../../utilities'

// const debug = require('debug')('ditto:scenes:chat:message:components:Reactions')

export default function Reactions ({ reactions, toggleReaction, myUserId, isMyBubble }) {
  const theme = useTheme()

  //* *******************************************************************************
  // Lifecycle
  //* *******************************************************************************
  return (
    <Wrapper style={{ flexDirection: isMyBubble ? 'row' : 'row-reverse' }}>
      {Object.keys(reactions).map(key => {
        const isSelected = !!reactions[key][myUserId]
        const selectedStyle = {
          backgroundColor: theme['color-primary-active'],
          borderWidth: 1.6,
          borderColor: theme['color-primary-800']
        }
        const toggle = () => toggleReaction(key)
        return (
          <ButtonWrapper key={key} onPress={toggle}>
            <ButtonContent
              style={[
                { backgroundColor: theme['color-basic-800'] },
                isSelected ? selectedStyle : {}
              ]}
            >
              <Text
                style={!isIos() ? {
                  fontFamily: 'NotoColorEmoji',
                  marginTop: -5
                } : {}}
              >
                {key}
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  marginTop: !isIos() ? -5 : null
                }}
                category='s1'
              >
                &nbsp;{`${Object.keys(reactions[key]).length}`}
              </Text>
            </ButtonContent>
          </ButtonWrapper>
        )
      })}
    </Wrapper>
  )
}

const Wrapper = styled.View`
  flex-direction: row;
  z-index: 2;
  margin-bottom: -28;
  margin-top: 8;
  flex-wrap: wrap;
`

const ButtonWrapper = styled.TouchableOpacity`
  width: 54;
  height: 25;
  justify-content: center;
  align-items: center;
  margin-bottom: 8;
`

const ButtonContent = styled.View`
  background-color: blue;
  width: 50;
  height: 30;
  padding-top: 2;
  border-radius: 30;
  border-width: 1;
  border-color: #00000050;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`
