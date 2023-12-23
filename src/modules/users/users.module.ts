import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { User } from './user.entity'
import { UsersRepository } from './users.repository'
import { UsersController } from './users.controller'
import { UsersProfileController } from './users-profile.controller'

import { AuthModule } from '@modules/auth'
import { StatisticsModule } from '@modules/statistics'
import { PlayerModule } from '@modules/player'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => AuthModule),
    StatisticsModule,
    PlayerModule,
  ],
  providers: [UsersRepository],
  controllers: [UsersController, UsersProfileController],
  exports: [UsersRepository],
})
export class UsersModule {}
