import PushNotificationIOS from '@react-native-community/push-notification-ios'
// import { Alert, Clipboard, Platform } from 'react-native'
import { Alert } from 'react-native'

const debug = require('debug')('ditto:utilities:NotificationIos')

export default class NotificationIos {
  startup () {
    return new Promise((resolve, reject) => {
      PushNotificationIOS.addEventListener(
        'register',
        token => this.onRegistered(token, resolve)
      )
      PushNotificationIOS.addEventListener(
        'registrationError',
        e => this.onRegistrationError(e, reject)
      )
      PushNotificationIOS.addEventListener(
        'notification',
        this.onRemoteNotification
      )
      PushNotificationIOS.addEventListener(
        'localNotification',
        this.onLocalNotification
      )

      PushNotificationIOS.requestPermissions()
    })
  }

  shutdown () {
    PushNotificationIOS.removeEventListener('register', this.onRegistered)
    PushNotificationIOS.removeEventListener(
      'registrationError',
      this.onRegistrationError
    )
    PushNotificationIOS.removeEventListener(
      'notification',
      this.onRemoteNotification
    )
    PushNotificationIOS.removeEventListener(
      'localNotification',
      this.onLocalNotification
    )
  }

  // **********************************************
  // Helpers
  // **********************************************

  onRegistered (token, resolve) {
    resolve(token)
  }

  onRegistrationError (e, reject) {
    debug('Failed to register for remote push', e.message)
    reject(e)
  }

  // alertBody : The message displayed in the notification alert.
  // alertTitle : The text displayed as the title of the notification alert.
  // alertAction : The "action" displayed beneath an actionable notification. Defaults to "view";
  // soundName : The sound played when the notification is fired (optional).
  // isSilent : If true, the notification will appear without sound (optional).
  // category : The category of this notification, required for actionable notifications (optional).
  // userInfo : An optional object containing additional notification data.
  // applicationIconBadgeNumber (option

  onRemoteNotification (notification) {
    PushNotificationIOS.presentLocalNotification({
      alertBody: 'You received a message',
      alertTitle: 'Ditto'
    })

    const result = `Message: ${notification.getMessage()};\n
      badge: ${notification.getBadgeCount()};\n
      sound: ${notification.getSound()};\n
      category: ${notification.getCategory()};\n
      content-available: ${notification.getContentAvailable()}.`

    Alert.alert('Push Notification Received', result, [
      {
        text: 'Dismiss',
        onPress: null
      }
    ])
  }

  onLocalNotification (notification) {
    // Alert.alert(
    //   'Local Notification Received',
    //   'Alert message: ' + notification.getMessage(),
    //   [
    //     {
    //       text: 'Dismiss',
    //       onPress: null
    //     }
    //   ]
    // )
  }
}
