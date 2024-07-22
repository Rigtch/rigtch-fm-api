import type { UserId } from '../types'

export type Timestamp = number
export type RepeatableJobId = `synchronize-history-${UserId}-repeatable`
export type TimestampJobId = `synchronize-history-${UserId}-${Timestamp}`

export function synchronizeJobIdFactory(
  id: UserId,
  repeatable?: false
): TimestampJobId
export function synchronizeJobIdFactory(
  id: UserId,
  repeatable: true
): RepeatableJobId

export function synchronizeJobIdFactory(id: UserId, repeatable = false) {
  return `synchronize-history-${id}-${repeatable ? 'repeatable' : Date.now()}`
}
