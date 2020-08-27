import { NativeModules } from 'react-native'

/**
 * A module that allows to display and handle MessagingStyle notifications for Android
 * @module MessagingNotificationAndroid
 *
 * A matrix user
 * @typedef {Object} User
 * @property {string} id The username of the person
 * @property {string} name The display name of the user
 * @property {string} avatar The avatar http url of the user
 *
 * A matrix room
 * @typedef {Object} Room
 * @property {string} id The unique id of the room
 * @property {string} title The title of the room
 * @property {string} avatar The http avatar URL for the room
 * @property {boolean} isDirect true if the room is a direct conversation
 *
 * A matrix message
 * @typedef {Object} Message
 * @property {string} id The unique id of the event associated to the message
 * @property {string} type The unique id of the event associated to the message
 * @property {Object} content An object containing the content of the message
 * @property {string} sender The matrix userId of the message sender
 * @property {int} timestamp The timestamp of when the message was sent
 *
 * A messaging notification
 * @typedef {Object} MessagingNotification
 * @property {string} me The matrix user id of the user receiving the notification whose displayName should be "Me"
 * @property {User[]} users The matrix users who sent at least one of the messages and the "Me" user
 * @property {Room} room The matrix room were the message was sent
 * @property {Message[]} messages The messages appearing in the notification
 * @property {string} channelId The channel id to set for the notification
 * @property {int} priority Priority level for the notification
 *
 * Get the room to show if the app was launched from a notification
 * @async
 * @function getInitialNotification
 * @return {Promise<MessagingNotification>} If the app was launched from a notification, will return a Promise with the notification, null otherwise
 *
 * Get notifications for the app (works only for Android >= N)
 * @async
 * @function getActiveNotifications
 * @return {Promise<MessagingNotification[]>} If there are notifications, returns a Promise with an array of notifications, null otherwise
 *
 * Cancel all notifications for the app
 * @async
 * @function cancelAllNotifications
 * @return null
 *
 * Cancel notification for a given room (on Android < N, calls cancelAllNotifications)
 * @async
 * @function cancelNotification
 * @param {string} roomId The id of the room to delete the notification of
 * @return null
 *
 * Create the notification channel for Android O+
 * @function createNotificationChannel
 * @param {Object} channel The details of the notification channel
 * @param {string} channel.id The unique id of the channel
 * @param {string} channel.name The name of the channel
 * @param {string} channel.description The description of the channel
 * @return null
 *
 * Display a notification
 * @function notify
 * @param {MessagingNotification} notification The details needed for a messaging notification
 * @return null
 */
module.exports = NativeModules.MessagingNotificationAndroid
