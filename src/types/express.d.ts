import type { User } from '@modules/users'

declare module 'express' {
  export interface Request {
    user?: User
  }
}
