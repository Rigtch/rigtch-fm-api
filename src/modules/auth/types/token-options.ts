import { RequireOnlyOne } from '~/common/types/utils'

export type TokenOptions = RequireOnlyOne<{
  refreshToken?: string
  code?: string
}>
