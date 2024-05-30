import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common'
import { AccessToken } from '@spotify/web-api-ts-sdk'

import { AuthorizeParams } from './types'

import { UsersRepository } from '@modules/users/users.repository'
import { ProfilesRepository } from '@modules/profiles'
import { SpotifyService } from '@modules/spotify'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    @Inject(forwardRef(() => UsersRepository))
    private readonly usersRepository: UsersRepository,
    private readonly profilesRepository: ProfilesRepository,
    private readonly spotifyService: SpotifyService
  ) {}

  async saveUser(token: AccessToken): Promise<AuthorizeParams> {
    const spotifyProfile = await this.spotifyService.users.profile(token)

    const foundUser = await this.usersRepository.findUserByProfileId(
      spotifyProfile.id
    )

    const { access_token: accessToken, refresh_token: refreshToken } = token

    let id: string

    if (foundUser) {
      id = foundUser.id
    } else {
      const profile =
        await this.profilesRepository.createProfile(spotifyProfile)

      const createdUser = await this.usersRepository.createUser({
        profile,
        refreshToken,
      })

      this.logger.log(
        `Scheduling history fetching for user ${createdUser.profile.displayName}`
      )

      id = createdUser.id
    }

    return {
      accessToken,
      refreshToken,
      id,
    }
  }
}
