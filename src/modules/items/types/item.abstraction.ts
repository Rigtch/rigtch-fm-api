import { ItemType } from '../enums'

export abstract class Item {
  id: string
  externalId: string
  name: string
  href: string
  type: ItemType
}
