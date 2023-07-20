import { Controller, Get, HttpStatus, Query, Redirect } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { firstValueFrom } from 'rxjs'
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger'

import { AuthService } from './auth.service'
import { spotifyAuthorizationScopes } from './config'
import { RedirectResponse } from './types'
import { AccessToken } from './decorators'

import { Environment } from '~/config'
import { AuthenticationType } from '@modules/auth/enums'

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
    private readonly configService: ConfigService
  ) {}

  @Get('login')
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
  @Redirect()
  async callback(@Query('code') code: string): Promise<RedirectResponse> {
    const { accessToken, refreshToken } = await firstValueFrom(
      this.authService.token({ code })
    )

    console.log('acessToken', accessToken)
    console.log('refreshToken', refreshToken)

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
  @ApiBearerAuth(AuthenticationType.REFRESH_TOKEN)
  refresh(@AccessToken() refreshToken: string) {
    return firstValueFrom(this.authService.token({ refreshToken }))
  }

  @Get('profile')
  @ApiBearerAuth(AuthenticationType.ACCESS_TOKEN)
  profile(@AccessToken() accessToken: string) {
    return firstValueFrom(this.authService.profile(accessToken))
  }
}
