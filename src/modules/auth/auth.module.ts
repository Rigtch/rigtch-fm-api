import { Module, forwardRef } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { HttpModule } from '@nestjs/axios'

import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'

import { Environment } from '@config/environment'
import { UsersModule } from '@modules/users'
import { ProfilesModule } from '@modules/profiles'
import { SpotifyModule } from '@modules/spotify'
import { HistoryModule } from '@modules/history'

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
      useFactory: (configService: ConfigService) => ({
        secret: configService.get(Environment.JWT_SECRET),
        signOptions: {
          expiresIn: '3600s',
        },
      }),
      inject: [ConfigService],
    }),
    SpotifyModule,
    ProfilesModule,
    HistoryModule,
    forwardRef(() => UsersModule),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
