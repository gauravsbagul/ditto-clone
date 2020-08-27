import { useNavigation } from '@react-navigation/native'
import { Button, Layout, useTheme } from '@ui-kitten/components'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StatusBar } from 'react-native'
import Image from 'react-native-scalable-image'
import styled from 'styled-components/native'

import WordmarkFile from '../../assets/icons/wordmark.svg'

const middleBlob = require('../../assets/images/blob1.png')
const topBlob = require('../../assets/images/blob2.png')
const bottomBlob = require('../../assets/images/blob3.png')

StatusBar.setBarStyle('light-content')

export default function LandingScreen () {
  const navigation = useNavigation()
  const theme = useTheme()

  const { t } = useTranslation('auth')

  const handleLoginPress = () => navigation.navigate('Login')
  return (
    <Layout level='4' style={{ flex: 1, justifyContent: 'space-between' }}>
      <TopBlob source={topBlob} />
      <MiddleBlob source={middleBlob} />
      <BottomBlob source={bottomBlob} />
      <Wordmark width={200} fill={theme['text-basic-color']} />
      <Button
        onPress={handleLoginPress}
        size='giant'
        status='info'
        style={{ borderRadius: 50, alignSelf: 'center', width: 200, marginBottom: 200 }}
      >
        {t('landing.loginButtonLabel')}
      </Button>
    </Layout>
  )
}

const TopBlob = styled(Image)`
  position: absolute;
  top: -80;
  right: -100;
`

const MiddleBlob = styled(Image)`
  position: absolute;
  top: -220;
  left: -420;
`

const BottomBlob = styled(Image)`
  position: absolute;
  bottom: -340;
  left: -220;
`

const Wordmark = styled(WordmarkFile)`
  margin-top: 150;
  margin-left: 30;
`
