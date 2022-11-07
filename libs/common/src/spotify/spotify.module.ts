import { Module } from '@nestjs/common'

import { SpotifyService } from './spotify.service'

@Module({
  providers: [SpotifyService],
  exports: [SpotifyService],
})
export class SpotifyModule {}
