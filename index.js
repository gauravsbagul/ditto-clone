/**
 * @format
 */

import './src/i18n'

import messaging from '@react-native-firebase/messaging'
import { AppRegistry, NativeModules, Platform } from 'react-native'
import { polyfillGlobal } from 'react-native/Libraries/Utilities/PolyfillFunctions'

import App from './App'
import { name as appName } from './app.json'
import auth from './src/scenes/auth/authService'
import notifications from './src/services/notifications/notificationsService'

// React Native's polyfills don't implement everything
polyfillGlobal('Buffer', () => require('buffer').Buffer)
polyfillGlobal('URL', () => require('whatwg-url').URL)

// Init services. Storage should go last since it will trigger everything
auth.init()
notifications.init()

// fix for https://github.com/kmagiera/react-native-gesture-handler/issues/320
if (Platform.OS === 'android') {
  const { UIManager } = NativeModules
  if (UIManager) {
    // Add gesture specific events to genericDirectEventTypes object exported from UIManager native module.
    // Once new event types are registered with react it is possible to dispatch these events to all kind of native views.
    UIManager.genericDirectEventTypes = {
      ...UIManager.genericDirectEventTypes,
      onGestureHandlerEvent: { registrationName: 'onGestureHandlerEvent' },
      onGestureHandlerStateChange: {
        registrationName: 'onGestureHandlerStateChange'
      }
    }
  }

  // Listen for FCM push notifications when app is in background
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    const debug = require('debug')('ditto:index:BackgroundMessageHandler')
    debug('Received FCM Message while in background:', remoteMessage)

    const data = remoteMessage.data
    if (data.event_id != null && data.room_id != null) {
      notifications.display(data.event_id, data.room_id)
    } else {
      debug(`No eventId (${data.event_id}) or roomId (${data.room_id})`)
    }
  })
}

AppRegistry.registerComponent(appName, () => App)
