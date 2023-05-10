import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'

import { AdapterModule } from '../adapter'
import { AuthModule } from '../auth'

import { StatisticsService } from './statistics.service'
import { StatisticsResolver } from './statistics.resolver'

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
    AuthModule,
  ],
  providers: [StatisticsService, StatisticsResolver],
})
export class StatisticsModule {}
