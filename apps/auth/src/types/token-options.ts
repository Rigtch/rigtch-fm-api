import { RequireOnlyOne } from '@lib/types'

export type TokenOptions = RequireOnlyOne<{
  refreshToken?: string
  code?: string
}>
