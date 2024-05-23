import { Injectable } from '@nestjs/common'

import { SpotifyAlbumsService } from './albums'
import { SpotifyArtistsService } from './artists'
import { SpotifyAuthService } from './auth'
import { SpotifyPlayerService } from './player'
import { SpotifyTracksService } from './tracks'
import { SpotifyUsersService } from './users'

@Injectable()
export class SpotifyService {
  constructor(
    readonly albums: SpotifyAlbumsService,
    readonly artists: SpotifyArtistsService,
    readonly tracks: SpotifyTracksService,
    readonly player: SpotifyPlayerService,
    readonly auth: SpotifyAuthService,
    readonly users: SpotifyUsersService
  ) {}
}
