import { ConfigModule, ConfigService } from '@nestjs/config'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import Joi from 'joi'
import { HttpModule } from '@nestjs/axios'

import { PlayerService } from './player.service'
import { Environment } from './config'
import { PlayerResolver } from './player.resolver'

import { SpotifyModule } from '@lib/common'

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: () => ({
        autoSchemaFile: true,
        playground: {
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
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/player/.env',
      validationSchema: Joi.object({
        PORT: Joi.number().default(4002),
        SPOTIFY_BASE_URL: Joi.string().required(),
      }),
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
  ],
  providers: [PlayerService, PlayerResolver],
})
export class PlayerModule {}
