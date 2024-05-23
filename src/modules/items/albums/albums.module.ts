import { Module, forwardRef } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { Album } from './album.entity'
import { AlbumsRepository } from './albums.repository'
import { AlbumsController } from './albums.controller'
import { AlbumsService } from './albums.service'

import { TracksModule } from '@modules/items/tracks'

@Module({
  imports: [TypeOrmModule.forFeature([Album]), forwardRef(() => TracksModule)],
  providers: [AlbumsRepository, AlbumsService],
  controllers: [AlbumsController],
  exports: [AlbumsRepository, AlbumsService],
})
export class AlbumsModule {}
