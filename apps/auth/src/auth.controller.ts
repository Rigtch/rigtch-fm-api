import { firstValueFrom } from 'rxjs'
import {
  Controller,
  Get,
  HttpStatus,
  Logger,
  Redirect,
  Req,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { AuthService } from './auth.service'
import { RedirectResponse, SpotifyAuthRequest } from './types'
import { Environment, spotifyAuthorizationScopes } from './config'

const {
  SPOTIFY_CALLBACK_URL,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_ACCOUNTS_URL,
  CLIENT_URL,
} = Environment

@Controller('auth/spotify')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  logger = new Logger('AuthController')

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
  async callback(@Req() { query: { code } }: SpotifyAuthRequest) {
    const { accessToken, refreshToken } = await firstValueFrom(
      this.authService.token({ code })
    )

    return {
      url: `${this.configService.get(CLIENT_URL)}/about?${new URLSearchParams({
        accessToken,
        refreshToken,
      })}`,
      statusCode: HttpStatus.PERMANENT_REDIRECT,
    }
  }
}
