import { Controller, Get, NotFoundException, Query } from '@nestjs/common'
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'

import { TracksRepository } from './tracks.repository'
import { Track } from './track.entity'

import { ApiAuth, Token } from '@modules/auth/decorators'
import { NOT_BEEN_FOUND, ONE_IS_INVALID } from '@common/constants'

@Controller('tracks')
@ApiTags('tracks')
@ApiAuth()
export class TracksController {
  constructor(private readonly tracksRepository: TracksRepository) {}

  @Get()
  @ApiOperation({
    summary: 'Getting all tracks.',
  })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'external-id', required: false })
  @ApiOkResponse({
    description: 'Tracks successfully found.',
    type: [Track],
  })
  @ApiNotFoundResponse({
    description: NOT_BEEN_FOUND('track'),
  })
  async getTracks(
    @Query('name') name?: string,
    @Query('external-id') externalId?: string,
    @Token() _token?: string
  ) {
    if (name) {
      const foundTrack = await this.tracksRepository.findTrackByName(name)

      if (!foundTrack) throw new NotFoundException(NOT_BEEN_FOUND('track'))

      return foundTrack
    }

    if (externalId) {
      const foundTrack =
        await this.tracksRepository.findTrackByExternalId(externalId)

      if (!foundTrack) throw new NotFoundException(NOT_BEEN_FOUND('track'))

      return foundTrack
    }

    return this.tracksRepository.findTracks()
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Getting a track by id.',
  })
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
  async getTrackById(@Query('id') id: string, @Token() _token?: string) {
    const foundTrack = await this.tracksRepository.findTrackById(id)

    if (!foundTrack) throw new NotFoundException(NOT_BEEN_FOUND('track'))

    return foundTrack
  }
}
