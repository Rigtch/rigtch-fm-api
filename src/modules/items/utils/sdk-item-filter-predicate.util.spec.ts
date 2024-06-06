import { ItemType } from '../enums'
import { Item } from '../types'

import { sdkItemFilterPredicate } from './sdk-item-filter-predicate.util'

const itemFactoryMock = (externalId: string): Item => ({
  externalId,
  id: '',
  name: '',
  href: '',
  type: ItemType.ALBUM,
})

describe('sdkItemFilterPredicate', () => {
  const items = [itemFactoryMock('1'), itemFactoryMock('2')]

  it('should return true if item with externalId equal to id exists', () => {
    const id = '1'

    const result = sdkItemFilterPredicate(id, items)

    expect(result).toBeFalsy()
  })

  it('should return false if item with externalId equal to id does not exist', () => {
    const id = '3'

    const result = sdkItemFilterPredicate(id, items)

    expect(result).toBeTruthy()
  })
})
