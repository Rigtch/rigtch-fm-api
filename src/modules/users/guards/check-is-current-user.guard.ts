import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { Request } from 'express'
import { ConfigService } from '@nestjs/config'

import { SpotifyService } from '@modules/spotify'
import { Environment } from '@config/environment'

@Injectable()
export class CheckIsCurrentUserGuard implements CanActivate {
  constructor(
    private readonly spotifyService: SpotifyService,
    private readonly configService: ConfigService
  ) {}

  async canActivate(context: ExecutionContext) {
    const { headers, user } = context.switchToHttp().getRequest<Request>()

    if (user!.id === this.configService.get<string>(Environment.PUBLIC_USER_ID))
      return true

    const accessToken = headers.authorization?.slice(7)

    const meProfile = await this.spotifyService.auth.getMeProfile(accessToken!)

    if (user!.profile.id !== meProfile.id)
      throw new ForbiddenException(
        'You are not authorized to modify playback state.'
      )

    return true
  }
}
