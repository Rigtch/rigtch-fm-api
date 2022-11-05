import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { catchError, Observable, tap } from 'rxjs'

import { Services } from '..'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(Services.AUTH) private readonly authClient: ClientProxy
  ) {}

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const authentication = this.getAuthentication(context)

    return this.authClient
      .send('validate_user', {
        Authentication: authentication,
      })
      .pipe(
        tap(response => {
          this.addUser(response, context)
        }),
        catchError(() => {
          throw new UnauthorizedException()
        })
      )
  }

  private getAuthentication(context: ExecutionContext): string {
    let authentication: string
    if (context.getType() === 'rpc') {
      authentication = context.switchToRpc().getData().Authentication
    } else if (context.getType() === 'http') {
      authentication = context.switchToHttp().getRequest()
        .cookies?.Authentication
    }
    if (!authentication) {
      throw new UnauthorizedException(
        'No value was provided for Authentication'
      )
    }
    return authentication
  }

  private addUser(user: unknown, context: ExecutionContext) {
    if (context.getType() === 'rpc') {
      context.switchToRpc().getData().user = user
    } else if (context.getType() === 'http') {
      context.switchToHttp().getRequest().user = user
    }
  }
}
