import { Icon, useTheme } from '@ui-kitten/components'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard } from 'react-native'
import { AutoGrowingTextInput } from 'react-native-autogrow-textinput'
import { useSafeArea } from 'react-native-safe-area-context'
import styled from 'styled-components/native'

import { COLORS } from '../../../constants'
import { isIos } from '../../../utilities'

export default function Composer ({ onType, onSend, onImagePick }) {
  const insets = useSafeArea()

  const [messageValue, setMessageValue] = useState('')
  const [marginBottom, setMarginBottom] = useState(insets.bottom + 10)
  const theme = useTheme()

  //* *******************************************************************************
  // Methods
  //* *******************************************************************************
  const typeMessage = (messageText) => {
    setMessageValue(messageText)
    const isTyping = messageText.length > 0
    onType(isTyping)
  }

  const handleSend = () => {
    onSend(messageValue)
    setMessageValue('')
  }

  const { t } = useTranslation('messages')

  //* *******************************************************************************
  // Lifecycle
  //* *******************************************************************************
  useEffect(() => {
    const keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => {
        setMarginBottom(10)
      }
    )
    const keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => {
        setMarginBottom(insets.bottom + 10)
      }
    )

    return () => {
      keyboardWillHideListener.remove()
      keyboardWillShowListener.remove()
    }
  }, [insets.bottom])

  return (
    <Wrapper style={{ marginBottom }}>
      <ActionButton style={{ padding: 10, backgroundColor: theme['color-primary-active'] }} onPress={onImagePick}>
        <Icon name='camera-outline' style={{ marginTop: -2, height: 25, width: 25 }} fill={theme['text-basic-color']} />
      </ActionButton>
      <GrowingTextInput
        placeholder={t('composer.placeholder')}
        placeholderTextColor='rgba(255,255,255,.3)'
        value={messageValue}
        onChangeText={typeMessage}
        style={{ borderColor: theme['border-basic-color-1'] }}
      />
      <ActionButton
        disabled={messageValue.length === 0}
        style={{ backgroundColor: theme['color-primary-active'] }}
        onPress={handleSend}
      >
        {isIos() ? (
          <Icon name='arrowhead-up' style={{ marginLeft: -1, marginTop: -3, height: 25, width: 25 }} fill={theme['text-basic-color']} />
        ) : (
          <Icon name='paper-plane' style={{ marginLeft: -3, height: 22, width: 22 }} rotation={45} fill={theme['text-basic-color']} />
        )}
      </ActionButton>
    </Wrapper>
  )
}

const Wrapper = styled.View`
  flex-direction: row;
  margin-top: 10;
  margin-bottom: 10;
`

const verticalPadding = isIos() ? 7 : 4
const GrowingTextInput = styled(AutoGrowingTextInput)`
  flex: 1;
  border-radius: 20;
  padding-top: ${verticalPadding};
  padding-bottom: ${verticalPadding};
  padding-left: 14;
  padding-right: 14;
  color: ${COLORS.gray.one};
  font-size: 16;
  letter-spacing: 0.3;
  font-weight: 400;
  height: ${isIos() ? 32 : 35};
  border-width: 1;
`

const actionButtonSize = isIos() ? 32 : 35
const ActionButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  border-radius: 40;
  margin-left: 8;
  margin-right: 8;
  width: ${actionButtonSize};
  height: ${actionButtonSize};
  align-self: flex-end;
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`
