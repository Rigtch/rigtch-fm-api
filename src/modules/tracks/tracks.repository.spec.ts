import { DataSource, In } from 'typeorm'
import { Test } from '@nestjs/testing'
import { MockInstance } from 'vitest'

import { TracksRepository, relations } from './tracks.repository'

import { ArtistsRepository } from '@modules/artists'
import { SpotifyTracksService } from '@modules/spotify/tracks'
import {
  albumEntityMock,
  artistEntitiesMock,
  sdkTrackMock,
  sdkTracksMock,
  trackEntitiesMock,
  trackEntityMock,
  trackMock,
} from '@common/mocks'
import { AlbumsRepository } from '@modules/albums'
import { SdkTrack } from '@common/types/spotify'
import { removeDuplicates } from '@common/utils'

describe('TracksRepository', () => {
  let tracksRepository: TracksRepository
  let artistsRepository: ArtistsRepository
  let albumsRepository: AlbumsRepository
  let spotifyTracksService: SpotifyTracksService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TracksRepository,
        {
          provide: DataSource,
          useValue: {
            createEntityManager: vi.fn(),
          },
        },
        {
          provide: ArtistsRepository,
          useValue: {
            findOrCreateArtistsFromExternalIds: vi.fn(),
          },
        },
        {
          provide: AlbumsRepository,
          useValue: {
            createAlbumFromExternalId: vi.fn(),
            createAlbumsFromExternalIds: vi.fn(),
          },
        },

        {
          provide: SpotifyTracksService,
          useValue: {
            getTrack: vi.fn(),
            getTracks: vi.fn(),
          },
        },
      ],
    }).compile()

    tracksRepository = module.get(TracksRepository)
    artistsRepository = module.get(ArtistsRepository)
    albumsRepository = module.get(AlbumsRepository)
    spotifyTracksService = module.get(SpotifyTracksService)
  })

  test('should be defined', () => {
    expect(tracksRepository).toBeDefined()
  })

  test('should find tracks', async () => {
    const findSpy = vi
      .spyOn(tracksRepository, 'find')
      .mockResolvedValue(trackEntitiesMock)

    expect(await tracksRepository.findTracks()).toEqual(trackEntitiesMock)
    expect(findSpy).toHaveBeenCalledWith({
      relations,
    })
  })

  test('should find track by external id', async () => {
    const externalId = 'externalId'

    const findOneSpy = vi
      .spyOn(tracksRepository, 'findOne')
      .mockResolvedValue(trackEntityMock)

    expect(await tracksRepository.findTrackByExternalId(externalId)).toEqual(
      trackEntityMock
    )
    expect(findOneSpy).toHaveBeenCalledWith({
      where: { externalId },
      relations,
    })
  })

  test('should find track by id', async () => {
    const id = 'id'

    const findOneSpy = vi
      .spyOn(tracksRepository, 'findOne')
      .mockResolvedValue(trackEntityMock)

    expect(await tracksRepository.findTrackById(id)).toEqual(trackEntityMock)
    expect(findOneSpy).toHaveBeenCalledWith({
      where: { id },
      relations,
    })
  })

  test('should find track by name', async () => {
    const name = 'name'

    const findOneSpy = vi
      .spyOn(tracksRepository, 'findOne')
      .mockResolvedValue(trackEntityMock)

    expect(await tracksRepository.findTrackByName(name)).toEqual(
      trackEntityMock
    )
    expect(findOneSpy).toHaveBeenCalledWith({
      where: { name },
      relations,
    })
  })

  test('should find tracks by external ids', async () => {
    const externalIds = ['id1', 'id2']

    const findSpy = vi
      .spyOn(tracksRepository, 'find')
      .mockResolvedValue(trackEntitiesMock)

    expect(await tracksRepository.findTracksByExternalIds(externalIds)).toEqual(
      trackEntitiesMock
    )
    expect(findSpy).toHaveBeenCalledWith({
      where: { externalId: In(externalIds) },
      relations,
    })
  })

  test('should create track', async () => {
    const findOrCreateArtistsByExternalIdsSpy = vi
      .spyOn(artistsRepository, 'findOrCreateArtistsFromExternalIds')
      .mockResolvedValue(artistEntitiesMock)
    const createSpy = vi
      .spyOn(tracksRepository, 'create')
      .mockReturnValue(trackEntityMock)
    const saveSpy = vi
      .spyOn(tracksRepository, 'save')
      .mockResolvedValue(trackEntityMock)

    expect(
      await tracksRepository.createTrack(sdkTrackMock, albumEntityMock)
    ).toEqual(trackEntityMock)

    expect(findOrCreateArtistsByExternalIdsSpy).toHaveBeenCalledWith(
      trackMock.artists.map(artist => artist.id)
    )
    expect(createSpy).toHaveBeenCalled()
    expect(saveSpy).toHaveBeenCalledWith(trackEntityMock)
  })

  test('should create track from external id', async () => {
    const getTrackSpy = (
      vi.spyOn(spotifyTracksService, 'getTrack') as unknown as MockInstance<
        [id: string, adapt: false],
        Promise<SdkTrack>
      >
    ).mockResolvedValue(sdkTrackMock)
    const createTrackSpy = vi
      .spyOn(tracksRepository, 'createTrack')
      .mockResolvedValue(trackEntityMock)

    expect(
      await tracksRepository.createTrackFromExternalId(
        sdkTrackMock.id,
        albumEntityMock
      )
    ).toEqual(trackEntityMock)
    expect(getTrackSpy).toHaveBeenCalledWith(sdkTrackMock.id, false)
    expect(createTrackSpy).toHaveBeenCalledWith(sdkTrackMock, albumEntityMock)
  })

  test('should create tracks from external ids', async () => {
    const getTracksSpy = (
      vi.spyOn(spotifyTracksService, 'getTracks') as unknown as MockInstance<
        [ids: string, adapt: false],
        Promise<SdkTrack[]>
      >
    ).mockResolvedValue(sdkTracksMock)
    const createTrackSpy = vi
      .spyOn(tracksRepository, 'createTrack')
      .mockResolvedValue(trackEntityMock)

    expect(
      await tracksRepository.createTracksFromExternalIds(
        sdkTracksMock.map(track => track.id),
        albumEntityMock
      )
    ).toEqual(trackEntitiesMock)
    expect(getTracksSpy).toHaveBeenCalledWith(
      sdkTracksMock.map(track => track.id),
      false
    )
    expect(createTrackSpy).toHaveBeenCalledWith(sdkTrackMock, albumEntityMock)
  })

  describe('findOrCreateTrackFromExternalId', () => {
    test('should find track by external id', async () => {
      const findTrackByExternalIdSpy = vi
        .spyOn(tracksRepository, 'findTrackByExternalId')
        .mockResolvedValue(trackEntityMock)
      const createAlbumFromExternalIdSpy = vi.spyOn(
        albumsRepository,
        'createAlbumFromExternalId'
      )

      expect(
        await tracksRepository.findOrCreateTrackFromExternalId(
          sdkTrackMock.id,
          albumEntityMock.externalId
        )
      ).toEqual(trackEntityMock)
      expect(findTrackByExternalIdSpy).toHaveBeenCalledWith(sdkTrackMock.id)
      expect(createAlbumFromExternalIdSpy).not.toHaveBeenCalled()
    })

    test('should create whole album and then find track by external id', async () => {
      const findTrackByExternalIdSpy = vi
        .spyOn(tracksRepository, 'findTrackByExternalId')
        .mockResolvedValueOnce(null)
        .mockResolvedValue(trackEntityMock)
      const createAlbumFromExternalIdSpy = vi.spyOn(
        albumsRepository,
        'createAlbumFromExternalId'
      )

      expect(
        await tracksRepository.findOrCreateTrackFromExternalId(
          sdkTrackMock.id,
          albumEntityMock.externalId
        )
      ).toEqual(trackEntityMock)
      expect(findTrackByExternalIdSpy).toHaveBeenCalledWith(sdkTrackMock.id)
      expect(findTrackByExternalIdSpy).toHaveBeenCalledTimes(2)
      expect(createAlbumFromExternalIdSpy).toHaveBeenCalledWith(
        albumEntityMock.externalId
      )
    })
  })

  describe('findOrCreateTracks', () => {
    test('should find tracks', async () => {
      const findTracksByExternalIdsSpy = vi
        .spyOn(tracksRepository, 'findTracksByExternalIds')
        .mockResolvedValue(trackEntitiesMock)

      expect(await tracksRepository.findOrCreateTracks(sdkTracksMock)).toEqual(
        trackEntitiesMock
      )
      expect(findTracksByExternalIdsSpy).toHaveBeenCalledWith(
        sdkTracksMock.map(track => track.id)
      )
    })

    test('should create tracks from external ids', async () => {
      const findTracksByExternalIdsSpy = vi
        .spyOn(tracksRepository, 'findTracksByExternalIds')
        .mockResolvedValueOnce([])
        .mockResolvedValue(trackEntitiesMock)
      const findOrCreateArtistsFromExternalIdsSpy = vi.spyOn(
        artistsRepository,
        'findOrCreateArtistsFromExternalIds'
      )
      const createAlbumsFromExternalIdsSpy = vi.spyOn(
        albumsRepository,
        'createAlbumsFromExternalIds'
      )

      expect(await tracksRepository.findOrCreateTracks(sdkTracksMock)).toEqual(
        trackEntitiesMock
      )
      expect(findTracksByExternalIdsSpy).toHaveBeenCalledWith(
        sdkTracksMock.map(track => track.id)
      )
      expect(findTracksByExternalIdsSpy).toHaveBeenCalledTimes(2)
      expect(findOrCreateArtistsFromExternalIdsSpy).toHaveBeenCalledWith(
        removeDuplicates(
          sdkTracksMock.flatMap(track => track.artists).map(artist => artist.id)
        )
      )
      expect(createAlbumsFromExternalIdsSpy).toHaveBeenCalledWith(
        removeDuplicates(sdkTracksMock.map(track => track.album.id))
      )
    })
  })
})
