import type { User } from '@modules/users'

export type UserId = User['id']
export type Timestamp = number
export type JobId = `synchronize-history-${UserId}-${Timestamp}`

export function synchronizeJobIdFactory(id: UserId): JobId {
  return `synchronize-history-${id}-${Date.now()}`
}
