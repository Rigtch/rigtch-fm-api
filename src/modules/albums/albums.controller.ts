import { Controller, Get, NotFoundException, Query } from '@nestjs/common'
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
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
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'external-id', required: false })
  @ApiOkResponse({
    description: 'Albums successfully found.',
    type: [Album],
  })
  @ApiNotFoundResponse({
    description: NOT_BEEN_FOUND('album'),
  })
  async getAlbums(
    @Query('name') name?: string,
    @Query('external-id') externalId?: string
  ) {
    if (name) {
      const foundAlbum = await this.albumsRepository.findAlbumByName(name)

      if (!foundAlbum) throw new NotFoundException(NOT_BEEN_FOUND('album'))

      return foundAlbum
    }

    if (externalId) {
      const foundAlbum =
        await this.albumsRepository.findAlbumByExternalId(externalId)

      if (!foundAlbum) throw new NotFoundException(NOT_BEEN_FOUND('album'))

      return foundAlbum
    }

    return this.albumsRepository.findAlbums()
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Getting an album by id.',
  })
  @ApiOkResponse({
    description: 'Album successfully found.',
    type: Album,
  })
  @ApiNotFoundResponse({
    description: NOT_BEEN_FOUND('album'),
  })
  async getAlbumById(@Query('id') id: string) {
    const foundAlbum = await this.albumsRepository.findAlbumById(id)

    if (!foundAlbum) throw new NotFoundException(NOT_BEEN_FOUND('album'))

    return foundAlbum
  }
}
