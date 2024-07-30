import { UnauthorizedException } from '@nestjs/common'
import type { BackoffOptions } from 'exponential-backoff'

export const defaultBackoffOptions: BackoffOptions = {
  numOfAttempts: 3,
  retry: error => {
    return !(
      error instanceof UnauthorizedException &&
      error.message === 'Invalid token'
    )
  },
}
