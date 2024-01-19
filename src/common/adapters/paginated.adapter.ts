import { Injectable } from '@nestjs/common'
import { Page } from '@spotify/web-api-ts-sdk'

@Injectable()
export class PaginatedAdapter {
  adapt<TItems, TAdaptedItems>(
    { items, next, href, limit, offset, previous }: Page<TItems>,
    adaptFunction: (items: TItems[]) => TAdaptedItems[]
  ): Page<TAdaptedItems> {
    return {
      offset,
      limit,
      next,
      previous,
      href,
      items: adaptFunction(items),
      total: items.length,
    }
  }
}
