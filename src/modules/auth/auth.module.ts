import { Module, forwardRef } from '@nestjs/common'

import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'

import { UsersModule } from '@modules/users'
import { ProfilesModule } from '@modules/profiles'
import { SpotifyModule } from '@modules/spotify'
import { HistoryModule } from '@modules/history'

@Module({
  imports: [
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
