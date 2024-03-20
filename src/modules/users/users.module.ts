import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { User } from './user.entity'
import { UsersRepository } from './users.repository'
import {
  UsersController,
  UsersPlaybackController,
  UsersProfileController,
} from './controllers'

import { AuthModule } from '@modules/auth'
import { SpotifyModule } from '@modules/spotify'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    SpotifyModule,
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
