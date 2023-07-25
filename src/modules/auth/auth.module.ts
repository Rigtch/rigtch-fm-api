import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { HttpModule } from '@nestjs/axios'

import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'

import { AdapterModule } from '@modules/adapter'
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
    AdapterModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
