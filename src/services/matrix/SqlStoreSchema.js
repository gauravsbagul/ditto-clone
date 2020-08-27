import { Model, tableSchema } from '@nozbe/watermelondb'
import { field, json } from '@nozbe/watermelondb/decorators'

export const STORE_PREFIX = 'matrix_'

const membershipSchema = tableSchema({
  name: `${STORE_PREFIX}memberships`,
  columns: [
    { name: 'room_id', type: 'string', isIndexed: true },
    { name: 'value', type: 'string' }
  ]
})
class MembershipModel extends Model {
  static table = `${STORE_PREFIX}memberships`

  @field('room_id') roomId
  @json('value', json => json) value
}

const roomSchema = tableSchema({
  name: `${STORE_PREFIX}rooms`,
  columns: [
    { name: 'membership', type: 'string' },
    { name: 'data', type: 'string' }
  ]
})
class RoomModel extends Model {
  static table = `${STORE_PREFIX}rooms`

  @field('membership') membership
  @json('data', json => json) data
}

const userSchema = tableSchema({
  name: `${STORE_PREFIX}users`,
  columns: [
    { name: 'value', type: 'string' }
  ]
})
class UserModel extends Model {
  static table = `${STORE_PREFIX}users`

  @json('value', json => json) value
}

export const matrixSchemas = [membershipSchema, roomSchema, userSchema]
export const matrixModels = [MembershipModel, RoomModel, UserModel]
