import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { ConfigModule, ConfigService } from '@nestjs/config'
import * as Joi from 'joi'
import { JwtModule } from '@nestjs/jwt'
import { HttpModule } from '@nestjs/axios'

import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'
import { Environment } from './config'
import { AuthController } from './auth.controller'
import { SpotifyStrategy } from './strategies'

import { SpotifyModule } from '@lib/common'

@Module({
  imports: [
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
        cors: {
          credentials: true,
          origin: true,
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/auth/.env',
      validationSchema: Joi.object({
        PORT: Joi.number().default(4001),
        SPOTIFY_CLIENT_ID: Joi.string().required(),
        SPOTIFY_CLIENT_SECRET: Joi.string().required(),
        SPOTIFY_CALLBACK_URL: Joi.string().required(),
        SPOTIFY_BASE_URL: Joi.string().required(),
        SPOTIFY_ACCOUNTS_URL: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
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
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get(Environment.JWT_SECRET),
          signOptions: {
            expiresIn: '3600s',
          },
        }
      },
      inject: [ConfigService],
    }),
    SpotifyModule,
  ],
  providers: [AuthService, AuthResolver, SpotifyStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
