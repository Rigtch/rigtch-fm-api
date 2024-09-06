import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'

import { SpotifyAuthService } from './auth'
import { SpotifyUsersService } from './users'
import { SpotifyPlayerService } from './player'
import { SpotifyArtistsService } from './artists'
import { SpotifyTracksService } from './tracks'
import { SpotifyAlbumsService } from './albums'
import { SpotifyService } from './spotify.service'

import { EnvService } from '@config/env'

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: (envService: EnvService) => ({
        baseURL: envService.get('SPOTIFY_BASE_URL'),
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }),
      inject: [EnvService],
    }),
  ],
  providers: [
    SpotifyAuthService,
    SpotifyUsersService,
    SpotifyPlayerService,
    SpotifyArtistsService,
    SpotifyTracksService,
    SpotifyAlbumsService,
    SpotifyService,
  ],
  exports: [SpotifyService],
})
export class SpotifyModule {}
