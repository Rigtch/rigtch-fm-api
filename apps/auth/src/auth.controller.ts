import {
  Controller,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common'
import { Response } from 'express'

import { SpotifyAuthGuard } from './guards/spotify-auth.guard'
import { AuthService } from './auth.service'
import { SpotifyAuthRequest, SpotifyAuth } from './types'

@Controller('auth/spotify')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @UseGuards(SpotifyAuthGuard)
  login() {
    return
  }

  @Get('callback')
  @UseGuards(SpotifyAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async callback(
    @Req() request: SpotifyAuthRequest,
    @Res() response: Response
  ): Promise<Response<unknown, SpotifyAuth>> {
    const { user, authInfo } = request

    if (!user) throw new ForbiddenException('User not found')

    request.user = undefined

    const jwt = this.authService.login(user)

    response.set('Authorization', `Bearer ${jwt}`)

    return response.json({ authInfo, user }) as Response<unknown, SpotifyAuth>
  }
}
