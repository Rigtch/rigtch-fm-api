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

import { TracksRepository, tracksRelations } from './tracks.repository'
import { Track } from './track.entity'
import { PaginationTracks } from './dtos'

import {
  MANY_SUCCESSFULLY_RETRIEVED,
  NOT_BEEN_FOUND,
  ONE_IS_INVALID,
  ONE_SUCCESSFULLY_RETRIEVED,
} from '@common/constants'
import { PaginationQuery } from '@common/dtos/pagination'

@Controller('tracks')
@ApiTags('tracks')
export class TracksController {
  constructor(private readonly tracksRepository: TracksRepository) {}

  @Get()
  @ApiOperation({
    summary: 'Getting all tracks.',
  })
  @ApiOkResponse({
    description: MANY_SUCCESSFULLY_RETRIEVED('tracks'),
    type: [PaginationTracks],
  })
  getTracks(@Query() { limit = 10, page = 1 }: PaginationQuery) {
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
    description: ONE_SUCCESSFULLY_RETRIEVED('track'),
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
