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

import { ArtistsRepository } from './artists.repository'
import { Artist } from './artist.entity'
import { PaginationArtistsDocument } from './docs'

import { PaginationQuery } from '@common/dtos'
import {
  NOT_BEEN_FOUND,
  ONE_IS_INVALID,
  ONE_SUCCESSFULLY_RETRIEVED,
} from '@common/constants'

@Controller('artists')
@ApiTags('artists')
export class ArtistsController {
  constructor(private readonly artistsRepository: ArtistsRepository) {}

  @Get()
  @ApiOperation({
    summary: 'Getting all artists.',
    description: 'Getting all artists that are synchronized.',
  })
  @ApiOkResponse({
    description: 'Artists successfully found.',
    type: [PaginationArtistsDocument],
  })
  getArtists(@Query() { limit = 10, page = 1 }: PaginationQuery) {
    return paginate(this.artistsRepository, { limit, page })
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
  async getArtistById(@Param('id') id: string) {
    const foundArtist = await this.artistsRepository.findArtistById(id)

    if (!foundArtist) throw new NotFoundException(NOT_BEEN_FOUND('artist'))

    return foundArtist
  }
}
