import { firstValueFrom } from 'rxjs'
import { Controller, Get, HttpStatus, Query, Redirect } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { AuthService } from './auth.service'
import { RedirectResponse } from './types'
import { Environment, spotifyAuthorizationScopes } from './config'

const {
  SPOTIFY_CALLBACK_URL,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_ACCOUNTS_URL,
  CLIENT_CALLBACK_URL,
} = Environment

@Controller('auth/spotify')
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
    return {
      url: `${this.configService.get(
        CLIENT_CALLBACK_URL
      )}?${new URLSearchParams({
        accessToken,
        refreshToken,
      })}`,
      statusCode: HttpStatus.PERMANENT_REDIRECT,
    }
  }
}
