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
import { firstValueFrom } from 'rxjs'
import { ApiExcludeEndpoint, ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { AuthService } from './auth.service'
import { spotifyAuthorizationScopes } from './config'
import { RedirectResponse } from './types'
import { Token, ApiAuth } from './decorators'
import { SecretData } from './dtos'

import { Environment } from '@config/environment'
import { AuthenticationType } from '@modules/auth/enums'
import { UsersRepository } from '@modules/users'
import { ProfilesService } from '@modules/profiles'

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
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => ProfilesService))
    private readonly profilesService: ProfilesService,
    private readonly usersRepository: UsersRepository
  ) {}

  @Get('login')
  @ApiExcludeEndpoint()
  @Redirect()
  login(): RedirectResponse {
    return {
      url: `${this.configService.get(
        SPOTIFY_ACCOUNTS_URL
      )}/authorize?${new URLSearchParams({
        client_id: this.configService.get(SPOTIFY_CLIENT_ID),
        response_type: 'code',
        redirect_uri: this.configService.get(SPOTIFY_CALLBACK_URL),
        scope: spotifyAuthorizationScopes.join(' '),
      })}`,
      statusCode: HttpStatus.PERMANENT_REDIRECT,
    }
  }

  @Get('callback')
  @ApiExcludeEndpoint()
  @Redirect()
  async callback(@Query('code') code: string): Promise<RedirectResponse> {
    const { accessToken, refreshToken } = await firstValueFrom(
      this.authService.token({ code })
    )

    const spotifyProfile = await firstValueFrom(
      this.authService.profile(accessToken)
    )

    const foundUser = await this.usersRepository.findUserByProfileId(
      spotifyProfile.id
    )

    if (!foundUser) {
      const profile = await this.profilesService.create(spotifyProfile)

      await this.usersRepository.createUser({
        profile,
        refreshToken,
      })
    }

    return {
      url: `${this.configService.get(
        CLIENT_CALLBACK_URL
      )}/api/authorize?${new URLSearchParams({
        accessToken,
        refreshToken,
      })}`,
      statusCode: HttpStatus.PERMANENT_REDIRECT,
    }
  }

  @Get('refresh')
  @ApiAuth(AuthenticationType.REFRESH_TOKEN)
  @ApiOkResponse({
    description: 'Access token has been succesfully refreshed',
    type: SecretData,
  })
  refresh(@Token() refreshToken: string) {
    return this.authService.token({ refreshToken })
  }

  @Get('profile')
  @ApiAuth(AuthenticationType.ACCESS_TOKEN)
  @ApiOkResponse({
    description: "User's profile has been succesfully found",
  })
  profile(@Token() accessToken: string) {
    return this.authService.profile(accessToken)
  }
}
