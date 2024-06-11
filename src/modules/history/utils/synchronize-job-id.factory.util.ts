import type { UserId } from '../types'

export type Timestamp = number
export type JobId = `synchronize-history-${UserId}-${Timestamp}`

export function synchronizeJobIdFactory(id: UserId): JobId {
  return `synchronize-history-${id}-${Date.now()}`
}
