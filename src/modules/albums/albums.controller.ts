import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common'
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { Pagination, paginate } from 'nestjs-typeorm-paginate'

import {
  AlbumsRepository,
  albumsSimplifiedRelations,
} from './albums.repository'
import { Album } from './album.entity'

import { NOT_BEEN_FOUND } from '@common/constants'
import { ApiPaginatedQuery } from '@common/decorators'
import { PaginatedQuery } from '@common/dtos'

@Controller('albums')
@ApiTags('albums')
export class AlbumsController {
  constructor(private readonly albumsRepository: AlbumsRepository) {}

  @Get()
  @ApiOperation({
    summary: 'Getting all albums.',
  })
  @ApiPaginatedQuery()
  @ApiOkResponse({
    description: 'Albums successfully found.',
    type: [Pagination<Album>],
  })
  async getAlbums(@Query() { limit = 10, page = 1 }: PaginatedQuery) {
    return paginate(
      this.albumsRepository,
      { limit, page },
      {
        relations: albumsSimplifiedRelations,
      }
    )
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
