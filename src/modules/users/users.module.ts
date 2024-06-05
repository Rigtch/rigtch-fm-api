import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { User } from './user.entity'
import { UsersRepository } from './users.repository'
import {
  UsersController,
  UsersHistoryController,
  UsersPlaybackController,
  UsersProfileController,
} from './controllers'

import { SpotifyModule } from '@modules/spotify'
import { HistoryTracksModule } from '@modules/history/tracks'
import { HistoryModule } from '@modules/history'
import { ItemsModule } from '@modules/items'
import { ProfilesModule } from '@modules/profiles'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    HistoryTracksModule,
    HistoryModule,
    SpotifyModule,
    ProfilesModule,
    ItemsModule,
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
