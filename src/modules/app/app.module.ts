import { Module } from '@nestjs/common'
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql'
import Joi from 'joi'
import { ConfigModule } from '@nestjs/config'

import { AdapterModule } from '@modules/adapter'
import { AuthModule } from '@modules/auth'
import { StatisticsModule } from '@modules/statistics'
import { PlayerModule } from '@modules/player'

@Module({
  imports: [
    AuthModule,
    AdapterModule,
    StatisticsModule,
    PlayerModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: () => ({
        cache: 'bounded',
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
      envFilePath: './.env',
      validationSchema: Joi.object({
        PORT: Joi.number().default(4000),
        SPOTIFY_CLIENT_ID: Joi.string().required(),
        SPOTIFY_CLIENT_SECRET: Joi.string().required(),
        SPOTIFY_CALLBACK_URL: Joi.string().required(),
        SPOTIFY_BASE_URL: Joi.string().required(),
        SPOTIFY_ACCOUNTS_URL: Joi.string().required(),
        CLIENT_CALLBACK_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
      }),
    }),
  ],
})
export class AppModule {}
