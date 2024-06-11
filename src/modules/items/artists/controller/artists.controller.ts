import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Query,
  UseInterceptors,
} from '@nestjs/common'
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger'
import {
  Paginate,
  PaginateConfig,
  PaginateQuery,
  PaginatedSwaggerDocs,
  paginate,
} from 'nestjs-paginate'
import { CacheInterceptor } from '@nestjs/cache-manager'

import { ArtistsRepository } from '../artists.repository'
import { Artist } from '../artist.entity'

import { ArtistTopTracksQuery } from './dtos'
import { ArtistAlbumsDocument, ArtistTopTracksDocument } from './docs'
import { ApiArtist } from './decorators'

import { ItemsService } from '@modules/items'
import { NOT_BEEN_FOUND, ONE_SUCCESSFULLY_RETRIEVED } from '@common/constants'
import { SpotifyService } from '@modules/spotify'

export const artistsPaginateConfig: PaginateConfig<Artist> = {
  sortableColumns: ['name'],
  nullSort: 'last',
  defaultLimit: 10,
  filterableColumns: {
    name: true,
  },
}

@Controller('artists')
@UseInterceptors(CacheInterceptor)
@ApiTags('artists')
export class ArtistsController {
  constructor(
    private readonly artistsRepository: ArtistsRepository,
    private readonly spotifyService: SpotifyService,
    private readonly itemsService: ItemsService
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Getting all artists (cached).',
    description: 'Getting all synchronized artists (cached).',
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
    summary: 'Getting an artist by id (cached).',
    description: 'Getting one artist specified by the id (cached).',
  })
  @ApiArtist()
  @ApiOkResponse({
    description: ONE_SUCCESSFULLY_RETRIEVED('artist'),
    type: Artist,
  })
  async getArtistById(@Param('id', ParseUUIDPipe) id: string) {
    const foundArtist = await this.artistsRepository
      .createQueryBuilder('artist')
      .leftJoinAndSelect('artist.images', 'images')
      .orderBy('images.width', 'ASC')
      .where('artist.id = :id', { id })

      .getOne()

    if (!foundArtist) throw new NotFoundException(NOT_BEEN_FOUND('artist'))

    return foundArtist
  }

  @Get(':id/top-tracks')
  @ApiOperation({
    summary: 'Getting artist top tracks by id (cached).',
    description: 'Getting artist top tracks specified by their id (cached).',
  })
  @ApiArtist()
  @ApiOkResponse({
    description: ONE_SUCCESSFULLY_RETRIEVED("artist's top tracks"),
    type: ArtistTopTracksDocument,
  })
  async getArtistTopTracks(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() { limit = 5 }: ArtistTopTracksQuery
  ): Promise<ArtistTopTracksDocument> {
    const foundArtist = await this.artistsRepository.findOneBy({
      id,
    })

    if (!foundArtist) throw new NotFoundException(NOT_BEEN_FOUND('artist'))

    const sdkTracks = await this.spotifyService.artists.topTracks(
      foundArtist.externalId
    )

    const tracks = await this.itemsService.findOrCreate(sdkTracks)

    return {
      tracks: tracks.slice(0, limit),
    }
  }

  @Get(':id/albums')
  @ApiOperation({
    summary: 'Getting artist albums by id (cached).',
    description: 'Getting artist albums specified by their id (cached).',
  })
  @ApiArtist()
  @ApiOkResponse({
    description: ONE_SUCCESSFULLY_RETRIEVED("artist's albums"),
    type: ArtistAlbumsDocument,
  })
  async getArtistAlbums(
    @Param('id', ParseUUIDPipe) id: string
  ): Promise<ArtistAlbumsDocument> {
    const foundArtist = await this.artistsRepository.findOneBy({
      id,
    })

    if (!foundArtist) throw new NotFoundException(NOT_BEEN_FOUND('artist'))

    const sdkAlbums = await this.spotifyService.artists.albums(
      foundArtist.externalId
    )

    const albums = await this.itemsService.findOrCreate(sdkAlbums)

    return {
      albums,
    }
  }
}
