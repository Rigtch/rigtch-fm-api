import { Controller, Get, NotFoundException, Param } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger'

import { TracksRepository } from './tracks.repository'
import { Track } from './track.entity'

import { NOT_BEEN_FOUND, ONE_IS_INVALID } from '@common/constants'

@Controller('tracks')
@ApiTags('tracks')
export class TracksController {
  constructor(private readonly tracksRepository: TracksRepository) {}

  @Get()
  @ApiOperation({
    summary: 'Getting all tracks.',
  })
  @ApiOkResponse({
    description: 'Tracks successfully found.',
    type: [Track],
  })
  @ApiNotFoundResponse({
    description: NOT_BEEN_FOUND('track'),
  })
  async getTracks() {
    return this.tracksRepository.findTracks()
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
