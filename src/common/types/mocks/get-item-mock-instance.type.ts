import { MockInstance } from 'vitest'

export type GetItemsMockInstance<T extends object> = MockInstance<
  [ids: string[], adapt: false],
  Promise<T[]>
>

export type GetItemMockInstance<T extends object> = MockInstance<
  [id: string, adapt: false],
  Promise<T>
>
