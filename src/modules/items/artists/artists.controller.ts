import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
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

import { ITEM_CACHE_DURATION } from '../constants'

import { ArtistsRepository } from './artists.repository'
import { Artist } from './artist.entity'

import {
  NOT_BEEN_FOUND,
  ONE_IS_INVALID,
  ONE_SUCCESSFULLY_RETRIEVED,
} from '@common/constants'

export const artistsPaginateConfig: PaginateConfig<Artist> = {
  sortableColumns: ['name'],
  nullSort: 'last',
  defaultLimit: 10,
  filterableColumns: {
    name: true,
  },
}

@Controller('artists')
@ApiTags('artists')
export class ArtistsController {
  constructor(private readonly artistsRepository: ArtistsRepository) {}

  @Get()
  @ApiOperation({
    summary: 'Getting all artists.',
    description: 'Getting all artists that are synchronized.',
  })
  @PaginatedSwaggerDocs(Artist, artistsPaginateConfig)
  getArtists(@Paginate() query: PaginateQuery) {
    const queryBuilder = this.artistsRepository
      .createQueryBuilder('artist')
      .leftJoinAndSelect('artist.images', 'images')
      .orderBy('images.width', 'ASC')

    return paginate(query, queryBuilder, artistsPaginateConfig)
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Getting an artist by id.',
    description: 'Getting one artist specified by the id.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    example: '293456e8-64f4-49f0-9811-6344bbf350a7',
  })
  @ApiOkResponse({
    description: ONE_SUCCESSFULLY_RETRIEVED('artist'),
    type: Artist,
  })
  @ApiNotFoundResponse({
    description: NOT_BEEN_FOUND('artist'),
  })
  @ApiBadRequestResponse({
    description: ONE_IS_INVALID('uuid'),
  })
  async getArtistById(@Param('id', ParseUUIDPipe) id: string) {
    const foundArtist = await this.artistsRepository
      .createQueryBuilder('artist')
      .leftJoinAndSelect('artist.images', 'images')
      .orderBy('images.width', 'ASC')
      .where('artist.id = :id', { id })
      .cache(`artist:${id}`, ITEM_CACHE_DURATION)
      .getOne()

    if (!foundArtist) throw new NotFoundException(NOT_BEEN_FOUND('artist'))

    return foundArtist
  }
}
