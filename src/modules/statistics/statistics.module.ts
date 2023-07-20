import { Module } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'

import { StatisticsService } from './statistics.service'
import { StatisticsResolver } from './statistics.resolver'
import { StatisticsController } from './statistics.controller'

import { AdapterModule } from '@modules/adapter'
import { AuthModule } from '@modules/auth'
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
  controllers: [StatisticsController],
  providers: [StatisticsService, StatisticsResolver],
})
export class StatisticsModule {}
