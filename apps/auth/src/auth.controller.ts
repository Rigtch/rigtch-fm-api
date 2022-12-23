import { firstValueFrom } from 'rxjs'
import {
  Controller,
  Get,
  Header,
  HttpStatus,
  Query,
  Redirect,
  Res,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Response } from 'express'

import { AuthService } from './auth.service'
import { RedirectResponse } from './types'
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

  @Get('login')
  @Header('access-control-allow-credentials', 'true')
  @Header('access-control-allow-origin', '*')
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
  @Header('access-control-allow-credentials', 'true')
  @Header('access-control-allow-origin', '*')
  @Redirect()
  async callback(
    @Query('code') code: string,
    @Res({ passthrough: true }) response: Response
  ): Promise<RedirectResponse> {
    const { accessToken, refreshToken } = await firstValueFrom(
      this.authService.token({ code })
    )

    response.cookie('access-token', accessToken)
    response.cookie('refresh-token', refreshToken)

    return {
      url: this.configService.get(CLIENT_URL),
      statusCode: HttpStatus.PERMANENT_REDIRECT,
    }
  }
}
