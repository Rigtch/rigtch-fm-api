import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Image } from './image.entity'
import { ImagesRepository } from './images.repository'

@Module({
  imports: [TypeOrmModule.forFeature([Image])],
  providers: [ImagesRepository],
  exports: [ImagesRepository],
})
export class ImagesModule {}
