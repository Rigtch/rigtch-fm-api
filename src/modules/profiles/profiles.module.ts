import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Profile } from './profile.entity'
import { ProfilesRepository } from './profiles.repository'

@Module({
  imports: [TypeOrmModule.forFeature([Profile])],
  providers: [ProfilesRepository],
  exports: [ProfilesRepository],
})
export class ProfilesModule {}
