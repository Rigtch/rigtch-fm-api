import type { AccessToken } from '@spotify/web-api-ts-sdk'

import type { User } from '@modules/users'

declare module 'express' {
  export interface Request {
    user?: User
    token?: AccessToken
  }
}
