import {
  Controller,
  ForbiddenException,
  Get,
  HttpStatus,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { Response } from 'express'
import { ConfigService } from '@nestjs/config'
import { stringify } from 'query-string'

import { SpotifyAuthGuard } from './guards'
import { AuthService } from './auth.service'
import { RedirectResponse, SpotifyAuthRequest } from './types'
import { Environment } from './config'

@Controller('auth/spotify')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @Get('login')
  @UseGuards(SpotifyAuthGuard)
  login() {
    return
  }

  @Get('callback')
  @UseGuards(SpotifyAuthGuard)
  @Redirect()
  async callback(
    @Req() request: SpotifyAuthRequest,
    @Res() response: Response
  ): Promise<RedirectResponse> {
    const {
      user,
      authInfo: { accessToken, refreshToken },
    } = request

    if (!user) throw new ForbiddenException('User not found')

    const jwt = this.authService.login(user)

    response.set('Authorization', `Bearer ${jwt}`)

    return {
      url: `${this.configService.get(Environment.CLIENT_URL)}/about?${stringify(
        {
          accessToken,
          refreshToken,
        }
      )}`,
      statusCode: HttpStatus.PERMANENT_REDIRECT,
    }
  }
}
