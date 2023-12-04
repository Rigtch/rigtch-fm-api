import { Module, forwardRef } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { ConfigService } from '@nestjs/config'

import { StatisticsService } from './statistics.service'
import { StatisticsController } from './statistics.controller'

import { Environment } from '@config/environment'
import { AuthModule } from '@modules/auth'

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
    forwardRef(() => AuthModule),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
