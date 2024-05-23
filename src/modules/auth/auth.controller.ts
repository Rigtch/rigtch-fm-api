import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Redirect,
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  ApiBody,
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'

import { spotifyAuthorizationScopes } from './config'
import { RedirectResponse } from './types'
import { RefreshToken, SecretData } from './dtos'
import { AuthService } from './auth.service'

import { Environment } from '@config/environment'
import { AdaptersService } from '@common/adapters'
import { SpotifyService } from '@modules/spotify'

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
    private readonly authService: AuthService,
    private readonly spotifyService: SpotifyService,
    private readonly adaptersService: AdaptersService
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
    const token = await this.spotifyService.auth.token({
      code,
    })

    return {
      url: `${this.configService.get(
        CLIENT_CALLBACK_URL
      )}/api/authorize?${new URLSearchParams({
        ...(await this.authService.saveUser(token)),
      }).toString()}`,
      statusCode: HttpStatus.PERMANENT_REDIRECT,
    }
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Refreshing access token.',
  })
  @ApiOkResponse({
    description: 'Access token has been successfully refreshed',
    type: SecretData,
  })
  @ApiBody({
    type: RefreshToken,
  })
  refresh(@Body() { refreshToken }: RefreshToken) {
    return this.spotifyService.auth
      .token({ refreshToken })
      .then(data => this.adaptersService.secretData.adapt(data))
  }
}
