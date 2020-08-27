import messaging from '@react-native-firebase/messaging'
import { AppState, NativeEventEmitter } from 'react-native'

import chats from '../../scenes/chat/chatService'
import matrix from '../matrix/matrixService'
import navigation, { route$ } from '../navigation/navigationService'
import MessagingNotificationAndroid from './MessagingNotificationAndroid'

const debug = require('debug')('ditto:services:notifications:NotificationAndroid')

const ANDROID_NOTIFICATION_CHANNEL_MAIN = 'com.elequin.ditto-main'
const ANDROID_NOTIFICATION_PRIORITY_HIGH = 2
const ANDROID_NOTIFICATION_PRIORITY_LOW = 0

export default class NotificationAndroid {
  constructor () {
    this._eventEmitter = new NativeEventEmitter(
      MessagingNotificationAndroid
    )
  }

  cancelAllNotifications () {
    MessagingNotificationAndroid.cancelAllNotifications()
  }

  cancelNotification (roomId) {
    MessagingNotificationAndroid.cancelNotification(roomId)
  }

  async startup () {
    debug('Starting notifications…')

    MessagingNotificationAndroid.createNotificationChannel({
      id: ANDROID_NOTIFICATION_CHANNEL_MAIN,
      name: 'Ditto Main Channel',
      description: 'Main Ditto Messages'
    })

    // Listen to opened notifications
    this._eventEmitter.addListener(
      'MessagingNotificationAndroid_opened',
      event => {
        debug('Notification opened event received:', event)
        if (event != null && event.roomId != null) {
          navigation.navigate('Chat', { chatId: event.roomId })
        }
      }
    )
    // Listen to replies in notifications
    this._eventEmitter.addListener(
      'MessagingNotificationAndroid_reply',
      event => {
        debug('Reply event received:', event)
        if (event != null) {
          this.replyInNotification(event.roomId, event.reply)
        }
      }
    )

    // Listen to FCM push notifications when app is opened
    messaging()
      .onMessage(async remoteMessage => {
        debug('Received FCM Message while in foreground:', remoteMessage)

        const data = remoteMessage.data
        if (data.event_id != null && data.room_id != null) {
          this.displayEventNotification(data.event_id, data.room_id)
        } else {
          debug(`No eventId (${data.event_id}) or roomId (${data.room_id})`)
        }
      })

    await messaging().registerDeviceForRemoteMessages()
    const pushkey = await messaging().getToken()

    return pushkey
  }

  async shutdown () {
    debug('Shutting down notifications…')

    // Invalidate token
    await messaging().deleteToken()
    await messaging().unregisterDeviceForRemoteMessages()

    // Remove MessagingNotificationAndroid listeners
    this._eventEmitter.removeAllListeners('MessagingNotificationAndroid_opened')
    this._eventEmitter.removeAllListeners('MessagingNotificationAndroid_reply')
  }

  // ********************************************************************************
  // Helpers
  // ********************************************************************************

  // Reply to a notification without opening the app
  async replyInNotification (roomId, reply) {
    if (roomId === null) {
      debug('No roomId')
    }
    if (reply === null || reply === '') {
      debug('No reply to send')
    }

    const chat = chats.getChatById(roomId)
    const replyEvent = await chat.sendMessage(reply, 'm.text')
    await this.displayEventNotification(replyEvent.event_id, roomId)
  }

  // Display a notification with the event data
  async displayEventNotification (eventId, roomId) {
    try {
      const openedChat = route$.getValue().name === 'Chat' ? route$.getValue().params.chatId : null
      if (AppState.currentState === 'active' && roomId === openedChat) {
        // Don't display notification if app is in foreground and room is opened
        throw Error(`Room ${roomId} is opened`)
      } else if (AppState.currentState !== 'active' && roomId === openedChat) {
        // Remove the notification if the app is reopened on the room
        AppState.addEventListener('change', nextAppState => {
          if (nextAppState === 'active') {
            this.cancelNotifications(roomId)
          }
        })
      }

      const eventDetails = await this._getEventDetails(eventId, roomId)

      // If we already have notifications for this room, append the new message to the older ones
      const oldNotifications = await MessagingNotificationAndroid.getActiveNotifications()
      const oldNotification = oldNotifications.find(
        notif => notif.room.id === roomId
      )

      const newNotification = Object.assign({}, oldNotification, {
        channelId: ANDROID_NOTIFICATION_CHANNEL_MAIN,
        priority: ANDROID_NOTIFICATION_PRIORITY_HIGH,
        room: eventDetails.room,
        me: eventDetails.me.id
      })

      if (oldNotification == null || Object.keys(oldNotification).length === 0) {
        Object.assign(newNotification, {
          users: [],
          messages: []
        })
      }

      // Add or update "me" in users
      const meIndex = newNotification.users.findIndex(
        user => user.id === eventDetails.me.id
      )
      if (meIndex === -1) {
        newNotification.users.push(eventDetails.me)
      } else {
        newNotification.users.splice(meIndex, 1, eventDetails.me)
      }
      if (eventDetails.sender.id === eventDetails.me.id) {
        // Don't make a sound for user's replies
        newNotification.priority = ANDROID_NOTIFICATION_PRIORITY_LOW
      } else {
        // Add or update sender in users
        const senderIndex = newNotification.users.findIndex(
          user => user.id === eventDetails.sender.id
        )
        if (senderIndex === -1) {
          newNotification.users.push(eventDetails.sender)
        } else {
          newNotification.users.splice(senderIndex, 1, eventDetails.sender)
        }
      }

      const messageIndex = newNotification.messages.findIndex(
        message => message.id === eventDetails.message.id
      )
      if (messageIndex === -1) {
        newNotification.messages.push(eventDetails.message)
      } else {
        // Because we can update the body after a redaction
        newNotification.messages.splice(messageIndex, 1, eventDetails.message)
      }

      MessagingNotificationAndroid.notify(newNotification)
    } catch (e) {
      debug('Notification not displayed: ', e.message)
    }
  }

  async _getEventDetails (eventId, roomId) {
    const details = {}

    const matrixRoom = matrix.getClient().getRoom(roomId)
    const timelineSet = matrixRoom.getUnfilteredTimelineSet()
    await matrix.getClient().getEventTimeline(timelineSet, eventId)
    const matrixEvent = timelineSet.findEventById(eventId)

    if (!matrixEvent.getType() === 'm.room.message') {
      throw Error(`Unhandled event type: ${matrixEvent.getType()}`)
    }

    details.message = {
      id: eventId,
      sender: matrixEvent.getSender(),
      timestamp: matrixEvent.getTs()
    }
    const content = matrixEvent.getContent()
    const msgtype = content.msgtype
    if (msgtype === 'm.text' || msgtype === 'm.notice') {
      details.message.type = 'text'
      // TODO: remove markdown
      details.message.content = { text: content.body }
    } else if (msgtype === 'm.image') {
      details.message.type = 'image'
      details.message.content = {
        text: 'sent an image',
        url: content.info.thumbnail_url,
        info: content.info.thumbnail_info
      }
    } else {
      throw Error(`Unhandled message type: ${msgtype}`)
    }

    const me = matrix.getClient().getUser(matrix.getClient().getUserId())
    const meAvatar = matrix.getImageUrl(me.avatarUrl, 50, 50, 'crop')
    details.me = {
      id: me.userId,
      name: 'Me',
      avatar: meAvatar
    }

    if (me.userId === matrixEvent.getSender()) {
      details.sender = details.me
    } else {
      const sender = matrix.getClient().getUser(matrixEvent.getSender())
      const senderAvatar = matrix.getImageUrl(sender.avatarUrl, 50, 50, 'crop')
      details.sender = {
        id: sender.userId,
        name: sender.displayName,
        avatar: senderAvatar
      }
    }

    const room = matrix.getClient().getRoom(roomId)
    const roomAvatar = matrix.getImageUrl(matrix.getRoomAvatar(room), 50, 50, 'crop')
    details.room = {
      id: roomId,
      title: room.name,
      avatar: roomAvatar,
      isDirect: room.isDirect
    }

    return details
  }
}
