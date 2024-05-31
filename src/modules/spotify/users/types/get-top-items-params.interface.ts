import { MaxInt } from '@spotify/web-api-ts-sdk'

import { TimeRange } from '../enums'

export interface GetTopItemsParams {
  timeRange?: TimeRange
  limit?: MaxInt<50>
  offset?: number
}
