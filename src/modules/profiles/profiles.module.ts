import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Profile } from './profile.entity'
import { ProfilesRepository } from './profiles.repository'
import { ProfilesService } from './profiles.service'

import { ImagesModule } from '@modules/images'

@Module({
  imports: [TypeOrmModule.forFeature([Profile]), ImagesModule],
  providers: [ProfilesRepository, ProfilesService],
  exports: [ProfilesRepository, ProfilesService],
})
export class ProfilesModule {}
