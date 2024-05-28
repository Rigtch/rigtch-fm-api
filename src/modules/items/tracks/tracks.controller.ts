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
import { PaginationTracksDocument, TrackDocument } from './docs'

import {
  MANY_SUCCESSFULLY_RETRIEVED,
  NOT_BEEN_FOUND,
  ONE_IS_INVALID,
  ONE_SUCCESSFULLY_RETRIEVED,
} from '@common/constants'
import { PaginationQuery } from '@common/dtos'

@Controller('tracks')
@ApiTags('tracks')
export class TracksController {
  constructor(private readonly tracksRepository: TracksRepository) {}

  @Get()
  @ApiOperation({
    summary: 'Getting all tracks.',
    description: 'Getting all tracks that are synchronized.',
  })
  @ApiOkResponse({
    description: MANY_SUCCESSFULLY_RETRIEVED('tracks'),
    type: [PaginationTracksDocument],
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
    description: 'Getting one track specified by the id.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    example: '71c6c7fe-cb38-43ac-916b-81e85115f520',
  })
  @ApiOkResponse({
    description: ONE_SUCCESSFULLY_RETRIEVED('track'),
    type: TrackDocument,
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
