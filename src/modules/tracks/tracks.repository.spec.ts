import { DataSource, In } from 'typeorm'
import { Test } from '@nestjs/testing'

import { TracksRepository } from './tracks.repository'

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

describe('TracksRepository', () => {
  let tracksRepository: TracksRepository

  let artistsRepository: ArtistsRepository
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
            findOrCreateArtistsByExternalIds: vi.fn(),
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
    spotifyTracksService = module.get(SpotifyTracksService)
  })

  test('should be defined', () => {
    expect(tracksRepository).toBeDefined()
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
    })
  })

  test('should create track', async () => {
    const findOrCreateArtistsByExternalIdsSpy = vi
      .spyOn(artistsRepository, 'findOrCreateArtistsByExternalIds')
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
    const getTrackSpy = vi
      .spyOn(spotifyTracksService, 'getTrack')
      // @ts-expect-error: type should match
      .mockResolvedValue(sdkTrackMock)
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

  test('should create tracks from ids', async () => {
    const getTracksSpy = vi
      .spyOn(spotifyTracksService, 'getTracks')
      // @ts-expect-error: type should match
      .mockResolvedValue(sdkTracksMock)
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
})
