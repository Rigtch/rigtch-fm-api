import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'

import { AdapterModule } from '../adapter'

import { PlayerService } from './player.service'
import { PlayerResolver } from './player.resolver'

import { Environment } from '~/config'

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
    AdapterModule,
  ],
  providers: [PlayerService, PlayerResolver],
})
export class PlayerModule {}
