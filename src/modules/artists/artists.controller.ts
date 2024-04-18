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
import { Pagination, paginate } from 'nestjs-typeorm-paginate'

import { ArtistsRepository } from './artists.repository'
import { Artist } from './artist.entity'

import { NOT_BEEN_FOUND, ONE_IS_INVALID } from '@common/constants'
import { ApiPaginatedQuery } from '@common/decorators'
import { PaginatedQuery } from '@common/dtos'

@Controller('artists')
@ApiTags('artists')
export class ArtistsController {
  constructor(private readonly artistsRepository: ArtistsRepository) {}

  @Get()
  @ApiOperation({
    summary: 'Getting all artists.',
  })
  @ApiPaginatedQuery()
  @ApiOkResponse({
    description: 'Artists successfully found.',
    type: [Pagination<Artist>],
  })
  getArtists(@Query() { limit = 10, page = 1 }: PaginatedQuery) {
    return paginate(this.artistsRepository, { limit, page })
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Getting an artist by id.',
  })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({
    description: 'Artist successfully found.',
    type: Artist,
  })
  @ApiNotFoundResponse({
    description: NOT_BEEN_FOUND('artist'),
  })
  @ApiBadRequestResponse({
    description: ONE_IS_INVALID('uuid'),
  })
  async getArtistById(@Param('id') id: string) {
    const foundArtist = await this.artistsRepository.findArtistById(id)

    if (!foundArtist) throw new NotFoundException(NOT_BEEN_FOUND('artist'))

    return foundArtist
  }
}
