import { Q } from '@nozbe/watermelondb'
import { MatrixEvent, MemoryStore, SyncAccumulator, User } from 'matrix-js-sdk'
import { InteractionManager } from 'react-native'

import { deepCopy } from '../../utilities'
import storage from '../storage'
import { STORE_PREFIX } from './SqlStoreSchema'

const debug = require('debug')('ditto:services:matrix:SqlStore')

// If this value is too small we'll be writing very often which will cause
// noticable stop-the-world pauses. If this value is too big we'll be writing
// so infrequently that the /sync size gets bigger on reload. Writing more
// often does not affect the length of the pause since the entire /sync
// response is persisted each time.
const WRITE_DELAY_MS = 1000 * 60 // once every minute

export default class SqlStore extends MemoryStore {
  constructor () {
    super()
    this._syncAccumulator = new SyncAccumulator()

    this.startedUp = false
    this._isNewlyCreated = false
    this._isSaving = false
    this._syncTs = 0

    // Records the last-modified-time of each user at the last point we saved
    // to storage, such that we can derive the set if users that have been
    // modified since we last saved.
    this._userModifiedMap = {
      // user_id : timestamp
    }
  }

  async startup () {
    debug('Startup')
    if (this.startedUp) {
      debug('Startup: already started')
      return
    }

    try {
      await InteractionManager.runAfterInteractions({
        name: `SqlStore.load.${STORE_PREFIX}data`,
        gen: async () => {
          const jsonAccountData = await storage.getItem(`${STORE_PREFIX}account_data`)
          const accountData = jsonAccountData ? JSON.parse(jsonAccountData) : null
          const jsonSyncData = await storage.getItem(`${STORE_PREFIX}sync`)
          const syncData = jsonSyncData ? JSON.parse(jsonSyncData) : {
            nextBatch: null,
            groupsData: null
          }
          if (!jsonSyncData) this._isNewlyCreated = true

          const roomsData = { join: {}, invite: {}, leave: {} }
          const dbRooms = await storage.getCollection(`${STORE_PREFIX}rooms`).query().fetch()
          for (const dbRoom of dbRooms) {
            roomsData[dbRoom.membership][dbRoom.id] = dbRoom.data
          }

          this._syncAccumulator.accumulate({
            next_batch: syncData.nextBatch,
            rooms: roomsData,
            groups: syncData.groupsData,
            account_data: {
              events: accountData
            }
          })

          const dbUsers = await storage.getCollection(`${STORE_PREFIX}users`).query().fetch()
          for (const user of dbUsers) {
            const u = new User(user.userId)
            if (user.event) {
              u.setPresenceEvent(new MatrixEvent(user.event))
            }
            this._userModifiedMap[u.userId] = u.getLastModifiedTime()
            this.storeUser(u)
          }
        }
      })
    } catch (e) {

    }
  }

  async getSavedSync () {
    const data = this._syncAccumulator.getJSON()
    if (!data.nextBatch) return null
    return deepCopy(data)
  }

  isNewlyCreated () {
    return this._isNewlyCreated
  }

  async getSavedSyncToken () {
    return this._syncAccumulator.getNextBatchToken()
  }

  async deleteAllData () {
    return storage.reset
  }

  wantsSave () {
    const now = Date.now()
    return now - this._syncTs > WRITE_DELAY_MS
  }

  save (force) {
    return new Promise((resolve) => {
      if (!this._isSaving && (force || this.wantsSave())) {
        this._isSaving = true
        InteractionManager.runAfterInteractions(async () => {
          this._syncTs = Date.now()
          await this._syncToStorage()
          this._isSaving = false
          resolve()
        })
      } else {
        resolve()
      }
    })
  }

  async _syncToStorage () {
    try {
      const syncData = this._syncAccumulator.getJSON()

      const updatedUserPresences = []
      for (const u of this.getUsers()) {
        if (this._userModifiedMap[u.userId] === u.getLastModifiedTime()) continue
        if (!u.events.presence) continue

        updatedUserPresences.push({
          userId: u.userId,
          event: u.events.presence.event
        })
        this._userModifiedMap[u.userId] = u.getLastModifiedTime()
      }

      const usersSync = []
      await InteractionManager.runAfterInteractions({
        name: `SqlStore.build.${STORE_PREFIX}users`,
        gen: async () => {
          if (updatedUserPresences.length > 0) {
            const dbUsers = await storage.getCollection(`${STORE_PREFIX}users`).query().fetch()
            for (const userPresence of updatedUserPresences) {
              const dbUser = dbUsers.find((user) => user.id === userPresence.userId)
              if (dbUser) {
                const updatedUser = dbUser.prepareUpdate(user => {
                  user.value = userPresence
                })
                usersSync.push(updatedUser)
              } else {
                const newUser = storage.getCollection(`${STORE_PREFIX}users`).prepareCreate(user => {
                  user._raw.id = userPresence.userId
                  user.value = userPresence
                })
                usersSync.push(newUser)
              }
            }
          }
        }
      })

      const roomsSync = []
      await InteractionManager.runAfterInteractions({
        name: `SqlStore.build.${STORE_PREFIX}rooms`,
        gen: async () => {
          const dbRooms = await storage.getCollection(`${STORE_PREFIX}rooms`).query().fetch()
          for (const [membership, syncRooms] of Object.entries(syncData.roomsData)) {
            for (const [roomId, roomData] of Object.entries(syncRooms)) {
              const roomIndex = dbRooms.findIndex(room => room.id === roomId)
              if (roomIndex === -1) {
                const newRoom = storage.getCollection(`${STORE_PREFIX}rooms`).prepareCreate(room => {
                  room._raw.id = roomId
                  room.membership = membership
                  room.data = roomData
                })
                roomsSync.push(newRoom)
              } else {
                const updatedRoom = dbRooms[roomIndex].prepareUpdate(room => {
                  room.membership = membership
                  room.data = roomData
                })
                roomsSync.push(updatedRoom)
                dbRooms.splice(roomIndex, 1)
              }
            }
          }
          if (dbRooms.length > 0) {
            for (const dbRoom of dbRooms) {
              roomsSync.push(dbRoom.prepareDestroyPermanently())
            }
          }
        }
      })

      if (usersSync.length > 0 || roomsSync.length > 0) {
        await InteractionManager.runAfterInteractions({
          name: `SqlStore.store.${STORE_PREFIX}rooms_users`,
          gen: async () => {
            await storage.batch([...usersSync, ...roomsSync])
          }
        })
      }

      await InteractionManager.runAfterInteractions({
        name: `SqlStore.store.${STORE_PREFIX}account_data`,
        gen: async () => {
          await storage.setItem(
            `${STORE_PREFIX}account_data`,
            JSON.stringify(syncData.accountData)
          )
        }
      })

      await InteractionManager.runAfterInteractions({
        name: `SqlStore.store.${STORE_PREFIX}sync`,
        gen: async () => {
          await storage.setItem(
            `${STORE_PREFIX}sync`,
            JSON.stringify({
              nextBatch: syncData.nextBatch,
              groupsData: syncData.groupsData
            })
          )
        }
      })
    } catch (e) {
      debug('Error syncing to storage')
    }
  }

  async setSyncData (syncData) {
    return this._syncAccumulator.accumulate(syncData)
  }

  async getOutOfBandMembers (roomId) {
    const memberships = []
    let oobWritten = false
    const dbMemberships = await storage.getCollection(`${STORE_PREFIX}memberships`)
      .query(Q.where('room_id', roomId))
      .fetch()
    for (const membership of dbMemberships) {
      if (membership.oob_written) {
        oobWritten = true
      } else {
        memberships.push(membership)
      }
    }
    if (memberships.length > 0 || oobWritten) {
      debug('Found %s membership events for room %s', memberships.length, roomId, memberships)
      return memberships
    }
  }

  async setOutOfBandMembers (roomId, membershipEvents) {
    MemoryStore.prototype.setOutOfBandMembers.call(this, roomId, membershipEvents)

    const dbMemberships = await storage.getCollection(`${STORE_PREFIX}memberships`)
      .query(Q.where('room_id', roomId))
      .fetch()
    const membershipsSync = []
    for (const membershipEvent of membershipEvents) {
      const dbMembership = dbMemberships.find((membership) =>
        membership.id === `${roomId}:${membershipEvent.state_key}`
      )
      if (dbMembership) {
        const updatedMembership = dbMembership.prepareUpdate(membership => {
          membership.value = membershipEvent
        })
        membershipsSync.push(updatedMembership)
      } else {
        const newMembership = storage.getCollection(`${STORE_PREFIX}memberships`).prepareCreate(membership => {
          membership._raw.id = `${roomId}:${membershipEvent.state_key}`
          membership.roomId = roomId
          membership.value = membershipEvent
        })
        membershipsSync.push(newMembership)
      }
    }
    // aside from all the events, we also write a marker object to the store
    // to mark the fact that OOB members have been written for this room.
    // It's possible that 0 members need to be written as all where previously know
    // but we still need to know whether to return null or [] from getOutOfBandMembers
    // where null means out of band members haven't been stored yet for this room
    const dbMarker = dbMemberships.find((membership) => membership.id === roomId)
    if (!dbMarker) {
      const newMembership = storage.getCollection(`${STORE_PREFIX}memberships`).prepareCreate((membership) => {
        membership._raw.id = roomId
        membership.roomId = roomId
        membership.value = { oob_written: true }
      })
      membershipsSync.push(newMembership)
    }
    await storage.batch(membershipsSync)
  }

  async clearOutOfBandMembers (roomId) {
    MemoryStore.prototype.clearOutOfBandMembers.call(this)

    return storage.action(async () => {
      await storage.getCollection(`${STORE_PREFIX}memberships`)
        .query(Q.where('room_id', roomId))
        .destroyAllPermanently()
    })
  }

  async getClientOptions () {
    const jsonClientOptions = await storage.getItem(`${STORE_PREFIX}client_options`)
    return JSON.parse(jsonClientOptions)
  }

  async storeClientOptions (options) {
    MemoryStore.prototype.storeClientOptions.call(this, options)

    return storage.setItem(`${STORE_PREFIX}client_options`, JSON.stringify(options))
  }
}
