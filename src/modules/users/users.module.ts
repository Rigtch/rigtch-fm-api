import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { User } from './user.entity'
import { UsersRepository } from './users.repository'
import {
  UsersController,
  UsersPlaybackController,
  UsersProfileController,
} from './controllers'

import { SpotifyModule } from '@modules/spotify'
import { ItemsModule } from '@modules/items'
import { ProfilesModule } from '@modules/profiles'
import { HistoryModule } from '@modules/history'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    SpotifyModule,
    ProfilesModule,
    HistoryModule,
    ItemsModule,
  ],
  providers: [UsersRepository],
  controllers: [
    UsersController,
    UsersProfileController,
    UsersPlaybackController,
  ],
  exports: [UsersRepository],
})
export class UsersModule {}
