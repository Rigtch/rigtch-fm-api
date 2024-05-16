import { EntityTarget } from 'typeorm'
import { MockInstance } from 'vitest'

export type EntityManagerCreateMockInstance = MockInstance<
  [entityClass: EntityTarget<unknown>, plainObjects?: unknown],
  unknown
>
