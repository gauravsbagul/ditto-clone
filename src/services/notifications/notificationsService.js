import { getDeviceName } from 'react-native-device-info'
import {
  MATRIX_PUSH_GATEWAY_APNS,
  MATRIX_PUSH_GATEWAY_FCM,
  MATRIX_PUSH_GATEWAY_URL
} from 'react-native-dotenv'
import { BehaviorSubject } from 'rxjs'

import { isIos } from '../../utilities'
import matrix from '../matrix/matrixService'
import { route$ } from '../navigation/navigationService'
import storage from '../storage'
import NotificationAndroid from './NotificationAndroid'
import NotificationIos from './NotificationIos'

const debug = require('debug')('ditto:services:notifications:notificationsService')

class NotificationsService {
  _nativeService
  _state$
  _isStarted
  _isSyncing

  constructor () {
    if (isIos()) {
      this._nativeService = new NotificationIos()
    } else {
      this._nativeService = new NotificationAndroid()
    }
    this._state$ = new BehaviorSubject(null)
    this._isStarted = false
    this._isSyncing = false
  }

  async init () {
    matrix.isReady$().subscribe((isReady) => {
      if (isReady) this._start()
      else if (!isReady) this._stop()
    })

    // TODO: remove notifications when chat opened?
    route$.subscribe((route) => {
      if (route && route.name === 'Chat' && route.params.chatId) {
        this.cancelByRoom(route.params.chatId)
      }
    })

    this._isSyncing = true
    const jsonState = await storage.getItem('notifications')
    let state = JSON.parse(jsonState)
    if (state == null) state = { enabled: true }
    this._state$.next(state)
    this._isSyncing = false
  }

  getState$ () {
    return this._state$
  }

  async setState (state) {
    if (this._isSyncing) debug('A storage interaction is already running, ignoring…')
    this._isSyncing = true
    this._state$.next(state)
    await storage.setItem('notifications', JSON.stringify(state))
    this._isSyncing = false
  }

  // ***************************************************************************
  // Actions
  // ***************************************************************************
  cancelByRoom (roomId) {
    if (!roomId || roomId === '') {
      throw Error('No roomId set')
    }
    if (!isIos()) {
      this._nativeService.cancelNotification(roomId)
    }
  }

  async disable () {
    return this._stop(true)
  }

  async display (eventId, roomId) {
    if (!isIos()) {
      await this._nativeService.displayEventNotification(eventId, roomId)
    }
  }

  async enable () {
    return this._start(true)
  }

  _cancelAll () {
    if (!isIos()) {
      this._nativeService.cancelAllNotifications()
    }
  }

  async _hasPusher (token) {
    const { pushers } = await matrix.getClient().getPushers()

    let pushkey = token
    let appId = null
    if (isIos()) {
      appId = MATRIX_PUSH_GATEWAY_APNS
      pushkey = Buffer.from(token, 'hex').toString('base64')
    } else {
      appId = MATRIX_PUSH_GATEWAY_FCM
    }

    for (const pusher of pushers) {
      if (pusher.app_id === appId &&
          pusher.pushkey === pushkey &&
          pusher.data.url === MATRIX_PUSH_GATEWAY_URL) {
        return true
      }
    }
    return false
  }

  async _setPusher (token, enable = true) {
    const deviceName = await getDeviceName() // TODO: Set on login and get from matrix client?

    let appId = null
    let pushkey = token
    if (isIos()) {
      appId = MATRIX_PUSH_GATEWAY_APNS
      // Convert to base64 since that's what sygnal expects
      pushkey = Buffer.from(token, 'hex').toString('base64')
    } else {
      appId = MATRIX_PUSH_GATEWAY_FCM
    }

    const pusher = {
      lang: 'en', // TODO:i18n: Get from device?
      kind: enable ? 'http' : null,
      app_display_name: 'Ditto', // TODO: Get from app?
      device_display_name: deviceName,
      app_id: appId,
      pushkey,
      data: {
        url: MATRIX_PUSH_GATEWAY_URL,
        format: 'event_id_only'
      },
      append: false
    }

    try {
      // Register the pusher
      debug('Setting Pusher:', pusher)
      const response = await matrix.getClient().setPusher(pusher)
      debug('Pusher response: ', response)
      if (Object.keys(response).length > 0) {
        debug('Error registering pusher on matrix homeserver:', response)
      }
    } catch (e) {
      debug('Error registering pusher on matrix homeserver:', e)
      throw e
    }
  }

  async _start (enable = false) {
    if (this._isStarted) return
    this._isStarted = true

    try {
      const { enabled } = this._state$.getValue()
      // On login, start notifications only if they are enabled
      if (!enabled && !enable) return

      const newState = { enabled: true }
      newState.pushkey = await this._nativeService.startup()

      const pusherExists = await this._hasPusher(newState.pushkey)
      if (!pusherExists) {
        await this._setPusher(newState.pushkey)
      }
      await this.setState(newState)
    } catch (e) {
      debug('Error starting notifications', e)
      this._isStarted = false
    }
  }

  async _stop (disable = false) {
    if (!this._isStarted) return
    this._isStarted = false

    try {
      // Remove notifications
      this._cancelAll()

      // Remove Matrix Pusher
      const state = this._state$.getValue()
      if (state.pushkey) await this._setPusher(state.pushkey, false)

      // Stop the service
      await this._nativeService.shutdown()

      // On logout, remove the settings but keep enabled state
      if (disable) {
        this.setState({ enabled: false })
      } else {
        this.setState({ enabled: state.enabled })
      }
    } catch (e) {
      debug('Error stopping notifications', e)
      this._isStarted = true
    }
  }

  // ***************************************************************************
  // Helpers
  // ***************************************************************************
  // Get the notification from which the app was opened if it was in the background or closed
  async getInitialNotification () {
    if (!isIos()) {
      return this._notifications.getInitialNotification()
    }
  }
}

const notificationsService = new NotificationsService()
export default notificationsService
