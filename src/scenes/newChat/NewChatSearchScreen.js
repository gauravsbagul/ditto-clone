import { useNavigation } from '@react-navigation/native'
import {
  Icon,
  Layout,
  TopNavigation,
  TopNavigationAction,
  useTheme
} from '@ui-kitten/components'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SafeAreaView, View } from 'react-native'
import styled from 'styled-components/native'

import { isIos } from '../../utilities'
import ChipInput from './components/ChipInput'

const debug = require('debug')('ditto:scenes:newChat:NewChatSearchScreen')

export default function NewChatSearchScreen () {
  //* *******************************************************************************
  // Properties
  //* *******************************************************************************
  const [selectedUsers, setSelectedUsers] = useState([])

  const navigation = useNavigation()
  const theme = useTheme()

  const { t } = useTranslation('newChat')

  //* *******************************************************************************
  // Methods
  //* *******************************************************************************
  const goBack = () => navigation.goBack()
  const updateSelectedUsers = selectedUsers => setSelectedUsers(selectedUsers)

  const handleConfirmMembers = () => {
    debug('selected members', selectedUsers)
    navigation.navigate('NewChatDetails', {
      usersToInvite: selectedUsers
    })
  }

  //* *******************************************************************************
  // Lifecycle
  //* *******************************************************************************
  return (
    <SafeAreaView style={{ backgroundColor: theme['background-basic-color-2'] }}>
      <TopNavigation
        title={t('title')}
        alignment='center'
        leftControl={!isIos() ? BackAction(goBack) : null}
        rightControls={isIos() ? CloseAction(goBack) : null}
        style={{ backgroundColor: theme['background-basic-color-2'] }}
        titleStyle={{ fontSize: 18 }}
      />
      <Layout level='4' style={{ height: '100%' }}>
        <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'center' }}>
          <ChipInput
            updateSelectedUsers={updateSelectedUsers}
          />
          <ActionButton
            style={{ padding: 10, backgroundColor: theme[selectedUsers.length === 0 ? 'color-primary-transparent-500' : 'color-primary-active'] }}
            onPress={handleConfirmMembers}
            disabled={selectedUsers.length === 0}
          >
            <Icon
              name={isIos() ? 'arrowhead-right' : 'arrow-forward'}
              width={25}
              height={25}
              fill={selectedUsers.length === 0 ? theme['text-disabled-color'] : theme['text-basic-color']}
              style={isIos() ? { marginLeft: 2 } : {}}
            />
          </ActionButton>
        </View>
      </Layout>
    </SafeAreaView>
  )
}

const BackAction = (onBack) => (
  <TopNavigationAction
    onPress={onBack}
    icon={BackIcon}
  />
)

const BackIcon = (style) => (
  <Icon {...style} name='arrow-back' width={30} height={30} />
)

const CloseAction = (onClose) => (
  <TopNavigationAction
    onPress={onClose}
    icon={CloseIcon}
  />
)

const CloseIcon = (style) => (
  <Icon {...style} name='close' width={30} height={30} />
)

const ActionButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
  border-radius: 40;
  margin-left: 8;
  margin-right: 8;
  width: 35;
  height: 35;
`
