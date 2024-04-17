import { Controller, Get, NotFoundException, Param } from '@nestjs/common'
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'

import { AlbumsRepository } from './albums.repository'
import { Album } from './album.entity'

import { NOT_BEEN_FOUND } from '@common/constants'

@Controller('albums')
@ApiTags('albums')
export class AlbumsController {
  constructor(private readonly albumsRepository: AlbumsRepository) {}

  @Get()
  @ApiOperation({
    summary: 'Getting all albums.',
  })
  @ApiOkResponse({
    description: 'Albums successfully found.',
    type: [Album],
  })
  async getAlbums() {
    return this.albumsRepository.findAlbums()
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Getting an album by id.',
  })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({
    description: 'Album successfully found.',
    type: Album,
  })
  @ApiNotFoundResponse({
    description: NOT_BEEN_FOUND('album'),
  })
  async getAlbumById(@Param('id') id: string) {
    const foundAlbum = await this.albumsRepository.findAlbumById(id)

    if (!foundAlbum) throw new NotFoundException(NOT_BEEN_FOUND('album'))

    return foundAlbum
  }
}
