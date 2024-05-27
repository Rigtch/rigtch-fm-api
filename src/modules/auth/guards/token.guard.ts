import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

import { SpotifyService } from '@modules/spotify'

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(private readonly spotifyService: SpotifyService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()

    const { refreshToken } = request.user

    const token = await this.spotifyService.auth.token({
      refreshToken,
    })

    request.token = token

    return true
  }
}
