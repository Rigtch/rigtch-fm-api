import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { AccessToken } from '@spotify/web-api-ts-sdk'

import { AuthorizeParams } from './types'

import { UsersRepository } from '@modules/users'
import { ProfilesRepository } from '@modules/profiles'
import { SpotifyUsersService } from '@modules/spotify/users'

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersRepository))
    private readonly usersRepository: UsersRepository,
    private readonly profilesRepository: ProfilesRepository,
    private readonly spotifyUsersService: SpotifyUsersService
  ) {}

  async saveUser(token: AccessToken): Promise<AuthorizeParams> {
    const spotifyProfile = await this.spotifyUsersService.profile(token)

    const foundUser = await this.usersRepository.findOneByProfileId(
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

      id = createdUser.id
    }

    return {
      accessToken,
      refreshToken,
      id,
    }
  }
}
