import { Test } from '@nestjs/testing'
import { MockInstance } from 'vitest'

import { AlbumsRepository } from './albums.repository'
import { AlbumsService } from './albums.service'

import { TracksService } from '@modules/tracks'
import { SpotifyAlbumsService } from '@modules/spotify/albums'
import {
  albumEntityMock,
  trackEntitiesMock,
  sdkAlbumMock,
  artistEntityMock,
} from '@common/mocks'
import { SdkAlbum } from '@common/types/spotify'

type GetAlbumMockInstance = MockInstance<
  [id: string, adapt: false],
  Promise<SdkAlbum>
>
type GetAlbumsMockInstance = MockInstance<
  [ids: string[], adapt: false],
  Promise<SdkAlbum[]>
>

describe('AlbumsService', () => {
  const externalId = 'externalId'

  let albumsService: AlbumsService
  let albumsRepository: AlbumsRepository
  let tracksService: TracksService
  let spotifyAlbumsService: SpotifyAlbumsService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AlbumsService,
        {
          provide: AlbumsRepository,
          useValue: {
            findAlbumByExternalId: vi.fn(),
            createAlbum: vi.fn(),
            findAlbumsByExternalIds: vi.fn(),
          },
        },
        {
          provide: TracksService,
          useValue: {
            createTracksFromExternalIds: vi.fn(),
          },
        },
        {
          provide: SpotifyAlbumsService,
          useValue: {
            getAlbum: vi.fn(),
            getAlbums: vi.fn(),
          },
        },
      ],
    }).compile()

    albumsService = module.get(AlbumsService)
    albumsRepository = module.get(AlbumsRepository)
    tracksService = module.get(TracksService)
    spotifyAlbumsService = module.get(SpotifyAlbumsService)
  })

  describe('findOrCreateAlbumFromExternalId', () => {
    test('should create tracks and return found album with tracks', async () => {
      const foundAlbumMock = {
        ...albumEntityMock,
        tracks: trackEntitiesMock,
      }

      const findAlbumByExternalIdSpy = vi
        .spyOn(albumsRepository, 'findAlbumByExternalId')
        .mockResolvedValue(foundAlbumMock)
      const getAlbumSpy = (
        vi.spyOn(
          spotifyAlbumsService,
          'getAlbum'
        ) as unknown as GetAlbumMockInstance
      ).mockResolvedValue(sdkAlbumMock)
      const createTracksFromExternalIdsSpy = vi
        .spyOn(tracksService, 'createTracksFromExternalIds')
        .mockResolvedValue(trackEntitiesMock)
      const createAlbumSpy = vi
        .spyOn(albumsRepository, 'createAlbum')
        .mockResolvedValue(albumEntityMock)

      expect(
        await albumsService.findOrCreateAlbumFromExternalId(externalId)
      ).toEqual(foundAlbumMock)
      expect(findAlbumByExternalIdSpy).toHaveBeenCalledWith(externalId)
      expect(getAlbumSpy).toHaveBeenCalledWith(externalId, false)
      expect(createTracksFromExternalIdsSpy).toHaveBeenCalledWith(
        trackEntitiesMock.map(track => track.id),
        foundAlbumMock
      )
      expect(createAlbumSpy).not.toHaveBeenCalled()
    })

    test('should create album from external id', async () => {
      const findAlbumByExternalIdSpy = vi
        .spyOn(albumsRepository, 'findAlbumByExternalId')
        .mockResolvedValue(null)
      const getAlbumSpy = (
        vi.spyOn(
          spotifyAlbumsService,
          'getAlbum'
        ) as unknown as GetAlbumMockInstance
      ).mockResolvedValue(sdkAlbumMock)
      const creatAlbumSpy = vi
        .spyOn(albumsRepository, 'createAlbum')
        .mockResolvedValue(albumEntityMock)

      expect(
        await albumsService.findOrCreateAlbumFromExternalId(externalId)
      ).toEqual(albumEntityMock)
      expect(findAlbumByExternalIdSpy).toHaveBeenCalledWith(externalId)
      expect(getAlbumSpy).toHaveBeenCalledWith(externalId, false)
      expect(creatAlbumSpy).toHaveBeenCalledWith(sdkAlbumMock)
    })
  })

  describe('findOrCreateAlbumsFromExternalIds', () => {
    test('should create albums from external ids', async () => {
      const externalIds = [externalId]

      const getAlbumsSpy = (
        vi.spyOn(
          spotifyAlbumsService,
          'getAlbums'
        ) as unknown as GetAlbumsMockInstance
      ).mockResolvedValue([sdkAlbumMock])
      const createAlbumSpy = vi
        .spyOn(albumsRepository, 'createAlbum')
        .mockResolvedValue(albumEntityMock)
      const findAlbumsByExternalIdsSpy = vi
        .spyOn(albumsRepository, 'findAlbumsByExternalIds')
        .mockResolvedValue([])

      expect(
        await albumsService.findOrCreateAlbumsFromExternalIds(externalIds)
      ).toEqual([albumEntityMock])
      expect(getAlbumsSpy).toHaveBeenCalledWith(externalIds, false)
      expect(createAlbumSpy).toHaveBeenCalledWith(sdkAlbumMock, undefined)
      expect(findAlbumsByExternalIdsSpy).toHaveBeenCalledWith(externalIds)
      expect(findAlbumsByExternalIdsSpy).toHaveBeenCalledTimes(
        externalIds.length
      )
    })

    test('should create tracks and return found album with tracks', async () => {
      const externalIds = [sdkAlbumMock.id]
      const foundAlbumMock = {
        ...albumEntityMock,
        tracks: trackEntitiesMock,
      }

      const getAlbumsSpy = (
        vi.spyOn(
          spotifyAlbumsService,
          'getAlbums'
        ) as unknown as GetAlbumsMockInstance
      ).mockResolvedValue([sdkAlbumMock])
      const findAlbumsByExternalIdsSpy = vi
        .spyOn(albumsRepository, 'findAlbumsByExternalIds')
        .mockResolvedValue([foundAlbumMock])
      const createTracksFromExternalIdsSpy = vi
        .spyOn(tracksService, 'createTracksFromExternalIds')
        .mockResolvedValue(trackEntitiesMock)
      const createAlbumSpy = vi.spyOn(albumsRepository, 'createAlbum')

      expect(
        await albumsService.findOrCreateAlbumsFromExternalIds(externalIds)
      ).toEqual([foundAlbumMock])
      expect(getAlbumsSpy).toHaveBeenCalledWith(externalIds, false)
      expect(findAlbumsByExternalIdsSpy).toHaveBeenCalledWith(externalIds)
      expect(createTracksFromExternalIdsSpy).toHaveBeenCalledWith(
        trackEntitiesMock.map(track => track.id),
        foundAlbumMock
      )
      expect(createAlbumSpy).not.toHaveBeenCalled()
    })

    test('should create albums from external ids with artists', async () => {
      const externalIds = [externalId]
      const artists = [artistEntityMock]

      const getAlbumsSpy = (
        vi.spyOn(
          spotifyAlbumsService,
          'getAlbums'
        ) as unknown as GetAlbumsMockInstance
      ).mockResolvedValue([sdkAlbumMock])
      const createAlbumSpy = vi
        .spyOn(albumsRepository, 'createAlbum')
        .mockResolvedValue(albumEntityMock)
      const findAlbumsByExternalIdsSpy = vi
        .spyOn(albumsRepository, 'findAlbumsByExternalIds')
        .mockResolvedValue([])

      expect(
        await albumsService.findOrCreateAlbumsFromExternalIds(
          externalIds,
          artists
        )
      ).toEqual([albumEntityMock])
      expect(getAlbumsSpy).toHaveBeenCalledWith(externalIds, false)
      expect(createAlbumSpy).toHaveBeenCalledWith(sdkAlbumMock, artists)
      expect(findAlbumsByExternalIdsSpy).toHaveBeenCalledWith(externalIds)
      expect(findAlbumsByExternalIdsSpy).toHaveBeenCalledTimes(
        externalIds.length
      )
    })
  })
})
