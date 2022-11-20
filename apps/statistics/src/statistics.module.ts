import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { HttpModule } from '@nestjs/axios'
import * as Joi from 'joi'
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql'

import { StatisticsController } from './statistics.controller'
import { StatisticsService } from './statistics.service'
import { Environment } from './config'
import { StatisticsResolver } from './statistics.resolver'

import { AuthModule, SpotifyModule } from '@lib/common'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/statistics/.env',
      validationSchema: Joi.object({
        PORT: Joi.number().default(4000),
        SPOTIFY_BASE_URL: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (configService: ConfigService) => ({
        autoSchemaFile: true,
        playground:
          configService.get(Environment.NODE_ENV) === 'production'
            ? false
            : {
                settings: {
                  'request.credentials': 'include',
                },
              },
        introspection: true,
        cors: {
          credentials: true,
          origin: true,
        },
      }),
      inject: [ConfigService],
    }),
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
    SpotifyModule,
    AuthModule,
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService, StatisticsResolver],
})
export class StatisticsModule {}
