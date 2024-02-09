import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

import { SpotifyAuthService } from './auth'
import { SpotifyUsersService } from './users'
import { SpotifyPlayerService } from './player'
import { SpotifyArtistsService } from './artists'

import { Environment } from '@config/environment'

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        baseURL: configService.get(Environment.SPOTIFY_BASE_URL),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    SpotifyAuthService,
    SpotifyUsersService,
    SpotifyPlayerService,
    SpotifyArtistsService,
  ],
  exports: [
    SpotifyAuthService,
    SpotifyUsersService,
    SpotifyPlayerService,
    SpotifyArtistsService,
  ],
})
export class SpotifyModule {}
