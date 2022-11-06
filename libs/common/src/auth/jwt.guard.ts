import { GqlExecutionContext } from '@nestjs/graphql'
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    return !!this.getAuthentication(context)
  }

  private getAuthentication(context: ExecutionContext): string {
    let authentication: string

    if (context.getType() === 'rpc') {
      authentication = context.switchToRpc().getData().authorization
    } else if (context.getType() === 'http') {
      authentication = context.switchToHttp().getRequest()
        .headers?.authorization
    } else {
      const newContext = GqlExecutionContext.create(context)

      authentication = newContext.getContext().req.headers?.authorization
    }

    if (!authentication) {
      throw new UnauthorizedException(
        'No value was provided for Authentication'
      )
    }
    return authentication
  }
}
