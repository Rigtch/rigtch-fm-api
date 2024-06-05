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

import { TracksRepository } from './tracks.repository'
import { TrackBaseDocument, TrackDocument } from './docs'
import { Track } from './track.entity'

import {
  NOT_BEEN_FOUND,
  ONE_IS_INVALID,
  ONE_SUCCESSFULLY_RETRIEVED,
} from '@common/constants'

export const tracksPaginateConfig: PaginateConfig<Track> = {
  sortableColumns: ['name'],
  nullSort: 'last',
  defaultLimit: 10,
  filterableColumns: {
    name: true,
  },
}

@Controller('tracks')
@ApiTags('tracks')
export class TracksController {
  constructor(private readonly tracksRepository: TracksRepository) {}

  @Get()
  @ApiOperation({
    summary: 'Getting all tracks.',
    description: 'Getting all tracks that are synchronized.',
  })
  @PaginatedSwaggerDocs(TrackBaseDocument, tracksPaginateConfig)
  getTracks(@Paginate() query: PaginateQuery) {
    const queryBuilder = this.tracksRepository
      .createQueryBuilder('track')
      .leftJoinAndSelect('track.artists', 'artists')
      .leftJoinAndSelect('artists.images', 'artistImages')
      .leftJoinAndSelect('track.album', 'album')
      .leftJoinAndSelect('album.images', 'images')
      .orderBy({
        'images.width': 'ASC',
        'artistImages.width': 'ASC',
      })

    return paginate(query, queryBuilder, tracksPaginateConfig)
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
  async getTrackById(@Param('id', ParseUUIDPipe) id: string) {
    const foundTrack = await this.tracksRepository
      .createQueryBuilder('track')
      .leftJoinAndSelect('track.artists', 'artists')
      .leftJoinAndSelect('artists.images', 'artistImages')
      .leftJoinAndSelect('track.album', 'album')
      .leftJoinAndSelect('album.images', 'images')
      .orderBy({
        'images.width': 'ASC',
        'artistImages.width': 'ASC',
      })
      .where('track.id = :id', { id })
      .getOne()

    if (!foundTrack) throw new NotFoundException(NOT_BEEN_FOUND('track'))

    return foundTrack
  }
}
