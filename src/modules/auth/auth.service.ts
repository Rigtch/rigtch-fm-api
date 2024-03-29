import { Inject, Injectable, Logger, forwardRef } from '@nestjs/common'
import { AccessToken } from '@spotify/web-api-ts-sdk'

import { AuthorizeParams } from './types'

import { UsersRepository } from '@modules/users'
import { ProfilesRepository } from '@modules/profiles'
import { SpotifyUsersService } from '@modules/spotify/users'
import { HistoryScheduler } from '@modules/history'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    @Inject(forwardRef(() => UsersRepository))
    private readonly usersRepository: UsersRepository,
    private readonly profilesRepository: ProfilesRepository,
    private readonly spotifyUsersService: SpotifyUsersService,
    private readonly historyScheduler: HistoryScheduler
  ) {}

  async saveUser(token: AccessToken): Promise<AuthorizeParams> {
    const spotifyProfile = await this.spotifyUsersService.profile(token)

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

      this.historyScheduler.triggerFetchingUserHistory(
        createdUser,
        await this.usersRepository.count()
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
