import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'

import { PlayerService } from './player.service'
import { PlayerController } from './player.controller'

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
  ],
  controllers: [PlayerController],
  providers: [PlayerService],
})
export class PlayerModule {}
