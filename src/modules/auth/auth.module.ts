import { Module, forwardRef } from '@nestjs/common'

import { AuthService } from './auth.service'

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
  exports: [AuthService],
})
export class AuthModule {}
