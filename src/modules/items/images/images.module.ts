import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Image } from './image.entity'
import { ImagesRepository } from './images.repository'
import { ImagesService } from './images.service'

@Module({
  imports: [TypeOrmModule.forFeature([Image])],
  providers: [ImagesRepository, ImagesService],
  exports: [ImagesRepository, ImagesService],
})
export class ImagesModule {}
