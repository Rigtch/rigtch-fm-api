import { Module } from '@nestjs/common'
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql'
import * as Joi from 'joi'
import { ConfigModule, ConfigService } from '@nestjs/config'

import { AdapterModule } from '@modules/adapter'
import { AuthModule } from '@modules/auth'
import { StatisticsModule } from '@modules/statistics'
import { PlayerModule } from '@modules/player'
import { Environment } from '~/config'

@Module({
  imports: [
    AuthModule,
    AdapterModule,
    StatisticsModule,
    PlayerModule,
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (configService: ConfigService) => ({
        cache: 'bounded',
        autoSchemaFile: true,
        context: ({ req, res }) => ({ req, res }),
        playground: {
          settings: {
            'request.credentials': 'include',
          },
        },
        introspection: true,
        cors: {
          credentials: true,
          methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
          origin: configService.get(Environment.CLIENT_CALLBACK_URL),
        },
      }),
      inject: [ConfigService],
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
