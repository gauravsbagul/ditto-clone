import { useNavigation } from '@react-navigation/native'
import {
  Button,
  Card,
  Icon,
  Input,
  Layout,
  Modal,
  Spinner,
  Text,
  TopNavigation,
  TopNavigationAction,
  useTheme
} from '@ui-kitten/components'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, SafeAreaView, StyleSheet, TextInput, TouchableWithoutFeedback, View } from 'react-native'
import Image from 'react-native-scalable-image'
import styled from 'styled-components/native'

import { SCREEN_HEIGHT, SCREEN_WIDTH } from '../../constants'
import { isIos } from '../../utilities'
import auth from './authService'

const topBlob = require('../../assets/images/blob4.png')
const bottomBlob = require('../../assets/images/blob5.png')

// const debug = require('debug')('ditto:scenes:auth:LoginScreen')

export default function LoginScreen () {
  const navigation = useNavigation()
  const passwordInput = useRef(null)
  const homeserverInput = useRef(null)
  const theme = useTheme()
  const { t } = useTranslation('auth')

  // State
  const [usernameValue, setUsernameValue] = useState('')
  const [usernameTooltipVisible, setUsernameTooltipVisible] = useState(false)
  const [passwordValue, setPasswordValue] = useState('')
  const [homeserverValue, setHomeserverValue] = useState('')
  const [errorText, setErrorText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [securePassword, setSecurePassword] = useState(true)

  const [passwordIsFocused, setPasswordIsFocused] = useState(false)
  const [homeserverIsFocused, setHomeserverIsFocused] = useState(false)

  // ********************************************************************************
  // Methods
  // ********************************************************************************

  const toggleUsernameTooltip = () => setUsernameTooltipVisible(!usernameTooltipVisible)

  const handleLoginPress = async () => {
    Keyboard.dismiss()
    if (usernameValue.length === 0) {
      setErrorText(t('login.missingUsernameError'))
    } else if (passwordValue.length === 0) {
      setErrorText(t('login.missingPasswordError'))
    } else {
      setErrorText('')
      setIsLoading(true)
      const response = await auth.loginWithPassword(usernameValue, passwordValue, homeserverValue)
      if (response.error) {
        setIsLoading(false)
        setErrorText(response.message)
      }
    }
  }

  const handleBackPress = () => navigation.goBack()

  const renderIcon = (props) => (
    <View style={{ position: 'absolute', right: 14, bottom: '23%' }}>
      <TouchableWithoutFeedback onPress={toggleUsernameTooltip}>
        <Icon fill='#7F7F7F60' width={24} height={24} name='question-mark-circle-outline' />
      </TouchableWithoutFeedback>
    </View>
  )

  const renderToggleSecureIcon = (props) => (
    <View style={{ position: 'absolute', right: 14, bottom: '23%' }}>
      <TouchableWithoutFeedback onPress={() => setSecurePassword(!securePassword)}>
        <Icon fill='#7F7F7F60' width={24} height={24} name={securePassword ? 'eye-off-outline' : 'eye-outline'} />
      </TouchableWithoutFeedback>
    </View>
  )

  // ********************************************************************************
  // Lifecycle
  // ********************************************************************************
  useEffect(() => {
    setErrorText('')
  }, [usernameValue, passwordValue])

  return (
    <Layout level='4' style={{ flex: 1 }}>
      <SafeAreaView>
        <TopNavigation
          title={t('login.title')}
          alignment='center'
          titleStyle={{ fontSize: 25 }}
          style={{ backgroundColor: 'transparent' }}
          leftControl={<BackAction onPress={handleBackPress} />}
        />
      </SafeAreaView>
      <TopBlob source={topBlob} />
      <BottomBlob source={bottomBlob} />

      <PageMargin keyboardShouldPersistTaps='handled'>
        <View style={{ position: 'relative' }}>
          <Input
            label={t('login.usernameOrMatrixIdInputLabel')}
            placeholder={t('login.usernameOrMatrixIdInputPlaceholder')}
            autoFocus
            size={isIos() ? 'large' : 'medium'}
            onChangeText={setUsernameValue}
            returnKeyType='next'
            onSubmitEditing={() => passwordInput.current.focus()}
            autoCapitalize='none'
          />
          {renderIcon()}
        </View>

        <Modal visible={usernameTooltipVisible} style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }}>
          <TouchableWithoutFeedback onPress={() => setUsernameTooltipVisible(false)}>
            <View style={{ flex: 1, backgroundColor: '#00000080', justifyContent: 'center', alignItems: 'center' }}>
              <Card disabled style={{ marginBottom: 250 }}>
                <Text category='h6' style={{ marginBottom: 6 }}>Acceptable values:</Text>
                <Text>Username only (defaults to matrix.org unless homeserver is specified){'\n'}</Text>
                <Text>Full Matrix ID (@john:matrix.org)</Text>
                <Button style={{ marginTop: 24 }} onPress={() => setUsernameTooltipVisible(false)}>
                  Got it!
                </Button>
              </Card>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <View>
          <Text category='c2' style={{ color: '#7F7F7F', marginTop: 12, marginBottom: 4 }}>{t('login.passwordInputLabel')}</Text>
          <View style={{ position: 'relative' }}>
            <TextInput
              placeholder={t('login.passwordInputPlaceholder')}
              style={[styles.dittoInput, {
                backgroundColor: passwordIsFocused ? theme['color-basic-700'] : theme['color-basic-800'],
                borderColor: passwordIsFocused ? '#9C37D4' : '#20122D'
              }]}
              onFocus={() => setPasswordIsFocused(true)}
              onBlur={() => setPasswordIsFocused(false)}
              ref={passwordInput}
              secureTextEntry={securePassword}
              value={passwordValue}
              onChangeText={setPasswordValue}
              autoCapitalize='none'
              placeholderTextColor='#808080'
              onSubmitEditing={handleLoginPress}
              returnKeyType='go'
            />
            {renderToggleSecureIcon()}
          </View>
        </View>

        {showAdvanced && (
          <View>
            <Text category='c2' style={{ color: '#7F7F7F', marginTop: 12, marginBottom: 4 }}>{t('login.homeserverInputLabel')}</Text>
            <TextInput
              placeholder={t('login.homeserverInputPlaceholder')}
              style={[styles.dittoInput, {
                backgroundColor: homeserverIsFocused ? theme['color-basic-700'] : theme['color-basic-800'],
                borderColor: homeserverIsFocused ? '#9C37D4' : '#20122D'
              }]}
              onFocus={() => setHomeserverIsFocused(true)}
              onBlur={() => setHomeserverIsFocused(false)}
              ref={homeserverInput}
              onChangeText={setHomeserverValue}
              autoCapitalize='none'
              autoCorrect={false}
              placeholderTextColor='#808080'
              onSubmitEditing={handleLoginPress}
              returnKeyType='go'
            >
              <Text>https://</Text>
            </TextInput>
          </View>
        )}

        <Button
          appearance='ghost'
          style={{ marginTop: 12, alignSelf: 'center' }}
          onPress={() => setShowAdvanced(!showAdvanced)}
        >
          {t(showAdvanced ? 'login.basicLabel' : 'login.advancedLabel')}
        </Button>

        <View style={{ marginTop: 40 }}>
          {isLoading ? (
            <Layout
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                height: 58,
                borderRadius: 50,
                backgroundColor: theme['color-info-500']
              }}
            >
              <Spinner status='basic' />
            </Layout>
          ) : (
            <Button
              onPress={handleLoginPress}
              size='giant'
              status='info'
              style={{ borderRadius: 50 }}
            >
              {t('login.loginButtonLabel')}
            </Button>
          )}
        </View>

        {errorText.length > 0 && (
          <Text
            status='danger'
            style={{ textAlign: 'center', marginTop: 15 }}
          >
            {t('login.somethingWrongError', { errorText: errorText })}
          </Text>
        )}
        <View style={{ height: SCREEN_HEIGHT / 2 }} />
      </PageMargin>
    </Layout>
  )
}

const BackAction = (props) => (
  <TopNavigationAction
    {...props}
    icon={style => <Icon {...style} name='arrow-ios-back' width='35' height='35' />}
  />
)

const PageMargin = styled.ScrollView`
  padding-left: 30;
  padding-right: 30;
  padding-top: 30;
`

const TopBlob = styled(Image)`
  position: absolute;
  top: -285;
  left: -100;
  z-index: -1;
`

const BottomBlob = styled(Image)`
  position: absolute;
  bottom: -500;
  left: -400;
`

const styles = StyleSheet.create({
  dittoInput: {
    width: '100%',
    height: 45,
    borderRadius: 4,
    paddingLeft: 20,
    borderWidth: 1,
    color: 'white'
  }
})
