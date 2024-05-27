import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common'
import { Request } from 'express'

import { SpotifyService } from '@modules/spotify'

@Injectable()
export class CheckIsCurrentUserGuard implements CanActivate {
  constructor(private readonly spotifyService: SpotifyService) {}

  async canActivate(context: ExecutionContext) {
    const { headers, user } = context.switchToHttp().getRequest<Request>()

    const accessToken = headers.authorization?.slice(7)

    const meProfile = await this.spotifyService.auth.getMeProfile(accessToken!)

    if (user!.profile.id !== meProfile.id)
      throw new ForbiddenException(
        'You are not authorized to modify playback state.'
      )

    return true
  }
}
