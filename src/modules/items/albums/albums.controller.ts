import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import { paginate } from 'nestjs-typeorm-paginate'

import {
  AlbumsRepository,
  albumsSimplifiedRelations,
} from './albums.repository'
import { AlbumDocument, PaginationAlbumsDocument } from './docs'

import { NOT_BEEN_FOUND, ONE_IS_INVALID } from '@common/constants'
import { PaginationQuery } from '@common/dtos'

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
    type: [PaginationAlbumsDocument],
  })
  async getAlbums(@Query() { limit = 10, page = 1 }: PaginationQuery) {
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
  @ApiParam({
    name: 'id',
    required: true,
    example: '4530c625-2385-45d6-8db1-8b867f125e30',
  })
  @ApiOkResponse({
    description: 'Album successfully found.',
    type: AlbumDocument,
  })
  @ApiNotFoundResponse({
    description: NOT_BEEN_FOUND('album'),
  })
  @ApiBadRequestResponse({
    description: ONE_IS_INVALID('uuid'),
  })
  async getAlbumById(@Param('id') id: string) {
    const foundAlbum = await this.albumsRepository.findAlbumById(id)

    if (!foundAlbum) throw new NotFoundException(NOT_BEEN_FOUND('album'))

    return foundAlbum
  }
}
