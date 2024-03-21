import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { User } from './user.entity'
import { UsersRepository } from './users.repository'
import {
  UsersController,
  UsersHistoryController,
  UsersPlaybackController,
  UsersProfileController,
} from './controllers'

import { AuthModule } from '@modules/auth'
import { SpotifyModule } from '@modules/spotify'
import { HistoryTracksModule } from '@modules/history/tracks'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    HistoryTracksModule,
    SpotifyModule,
  ],
  providers: [UsersRepository],
  controllers: [
    UsersController,
    UsersProfileController,
    UsersPlaybackController,
    UsersHistoryController,
  ],
  exports: [UsersRepository],
})
export class UsersModule {}
