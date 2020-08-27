import { BehaviorSubject } from 'rxjs'
import { map } from 'rxjs/operators'

import i18n from '../../i18n'
import matrix from '../../services/matrix/matrixService'
import storage from '../../services/storage'

const debug = require('debug')('ditto:scenes:auth:authService')

const initialAuthData = {
  userId: null,
  accessToken: null,
  homeserver: null,
  deviceId: null
}

class AuthService {
  _data$
  _isLoaded$
  _isSyncing

  constructor () {
    this._data$ = new BehaviorSubject(initialAuthData)
    this._isLoaded$ = new BehaviorSubject(false)
    this._isSyncing = false
  }

  async init () {
    this._isSyncing = true
    const jsonData = await storage.getItem('auth')
    const cleanData = this._sanitizeData(JSON.parse(jsonData))
    this._data$.next(cleanData)
    this._isLoaded$.next(true)
    this._isSyncing = false

    // We can be logged out of the session because of password reset for example
    matrix.isReady$().subscribe((isReady) => {
      if (isReady) {
        matrix.getClient().on('Session.logged_out', (e) => {
          // TODO warn the user why this happens
          debug('Logged out from the client', e)
          this.logout()
        })
      }
    })

    this.loginWithStoredCredentials()
  }

  // ********************************************************************************
  // Data
  // ********************************************************************************
  getUserId () {
    return this._data$.getValue().userId
  }

  isLoaded$ () {
    return this._isLoaded$
  }

  isLoggedIn$ () {
    return this._data$.pipe(map(data => data.userId && data.accessToken && data.homeserver))
  }

  async _setData (data) {
    if (this._isSyncing) debug('A storage interaction is already running')
    this._isSyncing = true
    const cleanData = this._sanitizeData(data)
    this._data$.next(cleanData)
    await storage.setItem('auth', JSON.stringify(cleanData))
    this._isSyncing = false
  }

  async _reset () {
    await this._setData(initialAuthData)
  }

  _sanitizeData (data) {
    return {
      userId: data?.userId,
      accessToken: data?.accessToken,
      homeserver: data?.homeserver,
      deviceId: data?.deviceId
    }
  }

  // ********************************************************************************
  // Actions
  // ********************************************************************************
  async loginWithPassword (username, password, homeserver) {
    console.log('AuthService -> loginWithPassword -> homeserver', homeserver)
    console.log('AuthService -> loginWithPassword -> password', password)
    console.log('AuthService -> loginWithPassword -> username', username)
    try {
      let user = username
      let domain = homeserver
      if (domain.length === 0) {
        const splitUser = user.split(':')
        if (splitUser.length === 2) {
          user = splitUser[0].slice(1)
          domain = splitUser[1]
        } else if (splitUser.length > 2) {
          return {
            error: 'INVALID_USERNAME',
            message: i18n.t('auth:login.invalidUsernameError')
          }
        } else domain = 'matrix.org'
      }

      const domainToCheck = domain.includes('https://') ? domain.slice(8) : domain
      console.log('AuthService -> loginWithPassword -> domainToCheck', domainToCheck)
      const homeserverData = await matrix.getHomeserverData(domainToCheck)
      console.log('AuthService -> loginWithPassword -> homeserverData', homeserverData)

      debug('Logging in as %s on %s', user, domain)
      await matrix.createClient(homeserverData.baseUrl || domain)
      const response = await matrix.getClient().loginWithPassword(user, password)

      matrix.start()

      const data = {
        userId: response.user_id,
        accessToken: response.access_token,
        homeserver: homeserverData.baseUrl,
        deviceId: response.device_id
      }
      console.log('AuthService -> loginWithPassword -> data', data)
      await this._setData(data)

      return data
    } catch (e) {
      debug('Error logging in:', e)
      const data = {}
      if (e.errcode) {
        // Matrix errors
        data.error = e.errcode
        switch (e.errcode) {
          case 'M_FORBIDDEN':
            data.message = i18n.t('auth:login.forbiddenError')
            break
          case 'M_USER_DEACTIVATED':
            data.message = i18n.t('auth:login.userDeactivatedError')
            break
          case 'M_LIMIT_EXCEEDED':
            data.message = i18n.t('auth:login.limitExceededError')
            break
          default:
            data.message = i18n.t('auth:login.unknownError')
        }
      } else {
        // Connection error
        // TODO: test internet connection
        data.error = 'NO_RESPONSE'
        data.message = i18n.t('auth:login.noResponseError')
      }
      return data
    }
  }

  async loginWithStoredCredentials () {
    try {
      const { homeserver, userId, accessToken } = this._data$.getValue()
      if (!homeserver || !userId || !accessToken) {
        return {
          error: 'NO_STORED_CREDENTIALS',
          message: i18n.t('auth:login.noStoredCredentialsError')
        }
      }
      debug('Logging in as %s on %s', userId, homeserver)
      await matrix.createClient(homeserver, userId, accessToken)

      matrix.start()

      return {
        homeserver,
        userId,
        accessToken
      }
    } catch (e) {
      debug('Error logging in:', e)
      const login = {}
      if (e.errcode) {
        login.error = e.errcode
        switch (e.errcode) {
          case 'M_UNKNOWN_TOKEN':
            login.message = i18n.t('auth:login.unknownTokenError')
            matrix.stop()
            break
          default:
            login.message = i18n.t('auth:login.unknownError')
        }
      } else {
        login.error = 'NO_ERRCODE'
        login.message = i18n.t('auth:login.noResponseError')
      }
      return login
    }
  }

  async logout () {
    try {
      await this._reset()
      await matrix.stop()
      // TODO: Maybe keep some settings
      await storage.reset()
    } catch (e) {
      debug('Error logging out', e)
    }
  }
}

const authService = new AuthService()
export default authService
