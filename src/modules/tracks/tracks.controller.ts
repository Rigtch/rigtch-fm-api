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

import { TracksRepository, tracksRelations } from './tracks.repository'
import { Track } from './track.entity'

import { NOT_BEEN_FOUND, ONE_IS_INVALID } from '@common/constants'
import { ApiPaginatedQuery } from '@common/decorators'
import { PaginatedQuery } from '@common/dtos'

@Controller('tracks')
@ApiTags('tracks')
export class TracksController {
  constructor(private readonly tracksRepository: TracksRepository) {}

  @Get()
  @ApiOperation({
    summary: 'Getting all tracks.',
  })
  @ApiPaginatedQuery()
  @ApiOkResponse({
    description: 'Tracks successfully found.',
    type: [Pagination<Track>],
  })
  getTracks(@Query() { limit = 10, page = 1 }: PaginatedQuery) {
    return paginate(
      this.tracksRepository,
      { limit, page },
      {
        relations: tracksRelations,
      }
    )
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Getting a track by id.',
  })
  @ApiParam({ name: 'id', required: true })
  @ApiOkResponse({
    description: 'Track successfully found.',
    type: Track,
  })
  @ApiNotFoundResponse({
    description: NOT_BEEN_FOUND('track'),
  })
  @ApiBadRequestResponse({
    description: ONE_IS_INVALID('uuid'),
  })
  async getTrackById(@Param('id') id: string) {
    const foundTrack = await this.tracksRepository.findTrackById(id)

    if (!foundTrack) throw new NotFoundException(NOT_BEEN_FOUND('track'))

    return foundTrack
  }
}
