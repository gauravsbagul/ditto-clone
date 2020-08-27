import {
  Avatar,
  Button,
  Icon,
  Input,
  Layout,
  ListItem,
  Spinner,
  Text,
  Toggle,
  TopNavigation,
  TopNavigationAction,
  useTheme
} from '@ui-kitten/components'
import { useObservableState } from 'observable-hooks'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Linking,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View
} from 'react-native'
import { getApplicationName, getVersion } from 'react-native-device-info'
import ImagePicker from 'react-native-image-picker'
import Touchable from 'react-native-platform-touchable'

import notifications from '../../services/notifications/notificationsService'
import { isIos } from '../../utilities'
import auth from '../auth/authService'
import users from '../user/userService'

const debug = require('debug')('ditto:scenes:settings:SettingsScreen')

const avatarSize = 60

export default function SettingsScreen ({ navigation }) {
  //* *******************************************************************************
  // Properties
  //* *******************************************************************************
  const pushNotifications = useObservableState(notifications.getState$())
  const user = users.getMyUser()
  const avatar = useObservableState(user.avatar$)
  const name = useObservableState(user.name$)

  const [nameValue, setNameValue] = useState(name)
  const [notifsSwitch, setNotifsSwitch] = useState({
    value: pushNotifications.enabled && pushNotifications.pushkey !== null,
    waiting: false
  })

  const theme = useTheme()

  const { t } = useTranslation('settings')

  //* *******************************************************************************
  // Methods
  //* *******************************************************************************
  const goBack = () => navigation.goBack()

  const chooseAvatar = () => {
    debug('chooseAvatar')
    const options = { title: t('chooseAvatarLabel'), mediaType: 'photo' }
    try {
      ImagePicker.showImagePicker(options, async response => {
        await user.setAvatar(response)
      })
    } catch (e) {
      debug('chooseAvatar error', e)
    }
  }

  const saveName = async () => {
    if (name !== nameValue) {
      await user.setName(nameValue)
    }
  }

  const switchNotifications = enable => {
    if (isIos()) return
    if (enable) {
      setNotifsSwitch({
        value: true,
        waiting: true
      })
      notifications.enable()
    } else {
      setNotifsSwitch({
        value: false,
        waiting: true
      })
      notifications.disable()
    }
  }

  const logout = async () => {
    auth.logout()
  }

  //* *******************************************************************************
  // Lifecycle
  //* *******************************************************************************
  useEffect(() => {
    setNameValue(name)
  }, [name])

  useEffect(() => {
    debug('Push notifications state updated', pushNotifications)
    setNotifsSwitch({
      value: pushNotifications.enabled && pushNotifications.pushkey != null,
      waiting: false
    })
  }, [pushNotifications])

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor: theme['background-basic-color-2'] }}>
        <TopNavigation
          style={{ backgroundColor: theme['background-basic-color-2'] }}
          title={t('title')}
          alignment='center'
          leftControl={!isIos() ? BackAction(goBack) : null}
          rightControls={isIos() ? CloseAction(goBack) : null}
          titleStyle={{ fontSize: 18 }}
        />
        <Layout level='4' style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ marginTop: 24 }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Touchable style={{ width: avatarSize, height: avatarSize, marginRight: 12 }} onPress={chooseAvatar}>
                <Avatar style={{ width: avatarSize, height: avatarSize }} source={{ uri: avatar ? users.getAvatarUrl(avatar) : null }} />
              </Touchable>
              <Input
                size={isIos() ? 'large' : 'small'}
                onChangeText={setNameValue}
                placeholder={t('displayNameInputPlaceholder')}
                value={nameValue}
                onBlur={saveName}
                style={{ minWidth: 150 }}
                label={t('displayNameInputLabel')}
              />
            </View>
            <ListItem
              style={{ backgroundColor: theme['background-basic-color-3'], marginTop: 30 }}
              title={t('notificationsEnabledLabel')}
              description={t('androidOnlyDescription')}
              accessory={() => (
                <LoadingSwitch
                  onChange={switchNotifications}
                  checked={notifsSwitch.value}
                  disabled={isIos()}
                  loading={notifsSwitch.waiting}
                />
              )}
            />
            <ListItem
              style={{ backgroundColor: theme['background-basic-color-3'], marginTop: 1 }}
              title={t('versionLabel', { app: getApplicationName() })}
              accessory={() => <Text>{getVersion()}</Text>}
            />

            <Text
              category='h6'
              appearance='hint'
              style={{ marginLeft: 15, marginTop: 40, marginBottom: 10 }}
            >
              {t('links.title')}
            </Text>
            <CustomListItem
              title={t('links.websiteLinkLabel')}
              url='https://dittochat.org'
              iconName='globe-2'
              iconColor={theme['color-info-500']}
            />
            <CustomListItem
              title={t('links.privacyPolicyLinkLabel')}
              url='https://dittochat.org/privacy'
              iconName='eye'
              iconColor={theme['color-success-500']}
            />
            <CustomListItem
              title={t('links.requestFeatureLinkLabel')}
              url='https://plan.dittochat.org'
              iconName='gift'
              iconColor={theme['color-warning-500']}
            />
            <CustomListItem
              title={t('links.reportProblemLinkLabel')}
              url='https://gitlab.com/ditto-chat/ditto-mobile/issues'
              iconName='alert-triangle'
              iconColor={theme['color-danger-500']}
            />

            <Button
              onPress={logout}
              appearance='outline'
              status='danger'
              style={{ marginTop: 60, marginHorizontal: 15, marginBottom: 50 }}
            >
              {t('logoutButtonLabel')}
            </Button>
          </ScrollView>
        </Layout>

      </SafeAreaView>
      <SafeAreaView style={{ backgroundColor: theme['background-basic-color-4'] }} />
    </>
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

const CustomListItem = ({ title, iconName, iconColor, url }) => {
  const theme = useTheme()
  const onPress = () => {
    try {
      debug('open website')
      Linking.openURL(url)
    } catch (err) {
      debug('open website error', err)
    }
  }
  return (
    <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 1, backgroundColor: theme['background-basic-color-3'] }}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Button appearance='ghost' icon={style => <Icon {...style} name={iconName} fill={iconColor} />} />
        <Text category='s2'>{title}</Text>
      </View>
      <Button appearance='ghost' icon={style => <Icon {...style} style={{ marginRight: 0 }} name='chevron-right' fill={theme['text-hint-color']} width={25} height={25} />} />
    </TouchableOpacity>

  )
}

const LoadingSwitch = ({ checked, disabled, loading, onChange }) => (
  <>
    {loading ? (
      <View style={{ marginRight: 5 }}>
        <Spinner size='tiny' />
      </View>
    ) : null}
    <Toggle
      onChange={onChange}
      checked={checked}
      disabled={disabled || loading}
    />
  </>
)
