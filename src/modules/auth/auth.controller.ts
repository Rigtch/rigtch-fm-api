import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Query,
  Redirect,
  forwardRef,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

import { spotifyAuthorizationScopes } from './config'
import { RedirectResponse } from './types'
import { Token, ApiAuth } from './decorators'
import { SecretData } from './dtos'

import { SpotifyAuthService } from '@modules/spotify/auth'
import { Environment } from '@config/environment'
import { AuthenticationType } from '@modules/auth/enums'
import { UsersRepository } from '@modules/users'
import { ProfilesService } from '@modules/profiles'
import { SpotifyUsersService } from '@modules/spotify/users'
import { adaptSecretData } from '@common/adapters'

const {
  SPOTIFY_CALLBACK_URL,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_ACCOUNTS_URL,
  CLIENT_CALLBACK_URL,
} = Environment

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => ProfilesService))
    private readonly profilesService: ProfilesService,
    private readonly usersRepository: UsersRepository,
    private readonly spotifyAuthService: SpotifyAuthService,
    private readonly spotifyUsersService: SpotifyUsersService
  ) {}

  @Get('login')
  @ApiExcludeEndpoint()
  @Redirect()
  login(): RedirectResponse {
    const params = new URLSearchParams({
      client_id: this.configService.get<string>(SPOTIFY_CLIENT_ID) ?? '',
      response_type: 'code',
      redirect_uri: this.configService.get<string>(SPOTIFY_CALLBACK_URL) ?? '',
      scope: spotifyAuthorizationScopes.join(' '),
    }).toString()

    return {
      url: `${this.configService.get(
        SPOTIFY_ACCOUNTS_URL
      )}/authorize?${params}`,
      statusCode: HttpStatus.PERMANENT_REDIRECT,
    }
  }

  @Get('callback')
  @ApiExcludeEndpoint()
  @Redirect()
  async callback(
    @Query('code') code: string
  ): Promise<RedirectResponse | undefined> {
    const token = await this.spotifyAuthService.token({
      code,
    })
    const spotifyProfile = await this.spotifyUsersService.profile(token)

    const foundUser = await this.usersRepository.findOneByProfileId(
      spotifyProfile.id
    )

    const { access_token: accessToken, refresh_token: refreshToken } = token

    if (refreshToken) {
      let id: string

      if (foundUser) {
        id = foundUser.id
      } else {
        const profile = await this.profilesService.create(spotifyProfile)

        const { id: createdUserId } = await this.usersRepository.createUser({
          profile,
          refreshToken,
        })

        id = createdUserId
      }

      return {
        url: `${this.configService.get(
          CLIENT_CALLBACK_URL
        )}/api/authorize?${new URLSearchParams({
          accessToken,
          refreshToken,
          id,
        }).toString()}`,
        statusCode: HttpStatus.PERMANENT_REDIRECT,
      }
    }
  }

  @Get('refresh')
  @ApiOperation({
    summary: 'Refreshing access token.',
  })
  @ApiAuth(AuthenticationType.REFRESH_TOKEN)
  @ApiOkResponse({
    description: 'Access token has been succesfully refreshed',
    type: SecretData,
  })
  refresh(@Token() refreshToken: string) {
    return this.spotifyAuthService.token({ refreshToken }).then(adaptSecretData)
  }
}
