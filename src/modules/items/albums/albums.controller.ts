import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  UseInterceptors,
} from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'
import {
  Paginate,
  PaginateConfig,
  PaginateQuery,
  PaginatedSwaggerDocs,
  paginate,
} from 'nestjs-paginate'
import { CacheInterceptor } from '@nestjs/cache-manager'

import { AlbumsRepository } from './albums.repository'
import { AlbumBaseDocument, AlbumDocument } from './docs'
import { Album } from './album.entity'

import {
  NOT_BEEN_FOUND,
  ONE_IS_INVALID,
  ONE_SUCCESSFULLY_RETRIEVED,
} from '@common/constants'

export const albumsPaginateConfig: PaginateConfig<Album> = {
  sortableColumns: ['name'],
  nullSort: 'last',
  defaultLimit: 10,
  filterableColumns: {
    name: true,
    albumType: true,
  },
}

@Controller('albums')
@UseInterceptors(CacheInterceptor)
@ApiTags('albums')
export class AlbumsController {
  constructor(private readonly albumsRepository: AlbumsRepository) {}

  @Get()
  @ApiOperation({
    summary: 'Getting all albums (cached).',
    description: 'Getting all albums that are synchronized (cached).',
  })
  @PaginatedSwaggerDocs(AlbumBaseDocument, albumsPaginateConfig)
  async getAlbums(@Paginate() query: PaginateQuery) {
    const queryBuilder = this.albumsRepository
      .createQueryBuilder('album')
      .leftJoinAndSelect('album.images', 'images')
      .leftJoinAndSelect('album.artists', 'artists')
      .leftJoinAndSelect('artists.images', 'artistImages')
      .orderBy({
        'images.width': 'ASC',
        'artistImages.width': 'ASC',
      })

    return paginate(query, queryBuilder, albumsPaginateConfig)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Getting an album by id (cached).',
    description: 'Getting one album specified by the id (cached).',
  })
  @ApiParam({
    name: 'id',
    required: true,
    example: '4530c625-2385-45d6-8db1-8b867f125e30',
  })
  @ApiOkResponse({
    description: ONE_SUCCESSFULLY_RETRIEVED('album'),
    type: AlbumDocument,
  })
  @ApiNotFoundResponse({
    description: NOT_BEEN_FOUND('album'),
  })
  @ApiBadRequestResponse({
    description: ONE_IS_INVALID('uuid'),
  })
  async getAlbumById(@Param('id', ParseUUIDPipe) id: string) {
    const foundAlbum = await this.albumsRepository
      .createQueryBuilder('album')
      .leftJoinAndSelect('album.images', 'images')
      .leftJoinAndSelect('album.artists', 'artists')
      .leftJoinAndSelect('artists.images', 'artistImages')
      .leftJoinAndSelect('album.tracks', 'tracks')
      .leftJoinAndSelect('tracks.artists', 'trackArtists')
      .leftJoinAndSelect('trackArtists.images', 'trackArtistImages')
      .orderBy({
        'images.width': 'ASC',
        'artistImages.width': 'ASC',
        'trackArtistImages.width': 'ASC',
      })
      .where('album.id = :id', { id })
      .getOne()

    if (!foundAlbum) throw new NotFoundException(NOT_BEEN_FOUND('album'))

    return foundAlbum
  }
}
