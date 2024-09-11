import { Test, TestingModule } from '@nestjs/testing'
import { DataSource, EntityManager } from 'typeorm'
import { MockInstance } from 'vitest'

import { ArtistsService } from '../artists'

import { Album } from './album.entity'
import { AlbumSubscriber } from './album.subscriber'

import {
  albumEntityMock,
  entityManagerFactoryMock,
  sdkAlbumMock,
  sdkArtistsMock,
  transactionFactoryMock,
} from '@common/mocks'
import { SpotifyService } from '@modules/spotify'

describe('AlbumSubscriber', () => {
  let moduleRef: TestingModule
  let albumSubscriber: AlbumSubscriber
  let spotifyService: SpotifyService
  let artistsService: ArtistsService
  let entityManagerMock: EntityManager

  beforeEach(async () => {
    entityManagerMock = entityManagerFactoryMock()

    moduleRef = await Test.createTestingModule({
      providers: [
        AlbumSubscriber,
        {
          provide: DataSource,
          useValue: {
            subscribers: [],
            transaction: transactionFactoryMock(entityManagerMock),
          },
        },
        {
          provide: SpotifyService,
          useValue: {
            albums: {
              get: vi.fn(),
            },
            artists: {
              get: vi.fn(),
            },
          },
        },
        {
          provide: ArtistsService,
          useValue: {
            findOrCreate: vi.fn(),
          },
        },
      ],
    }).compile()

    albumSubscriber = moduleRef.get(AlbumSubscriber)
    spotifyService = moduleRef.get(SpotifyService)
    artistsService = moduleRef.get(ArtistsService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(albumSubscriber).toBeDefined()
  })

  test('should listen to album entity', () => {
    expect(albumSubscriber.listenTo()).toEqual(Album)
  })

  describe('afterLoad', () => {
    let albumMock: Album

    let spotifyGetAlbumSpy: MockInstance
    let spotifyGetArtistsSpy: MockInstance
    let findOrCreateSpy: MockInstance
    let saveSpy: MockInstance

    beforeEach(() => {
      albumMock = albumEntityMock

      spotifyGetAlbumSpy = vi.spyOn(spotifyService.albums, 'get')
      spotifyGetArtistsSpy = vi.spyOn(spotifyService.artists, 'get')
      findOrCreateSpy = vi.spyOn(artistsService, 'findOrCreate')
      saveSpy = vi.spyOn(entityManagerMock, 'save')
    })

    test('should skip if album has artists', async () => {
      await albumSubscriber.afterLoad(albumMock)

      expect(spotifyGetAlbumSpy).not.toHaveBeenCalled()
      expect(spotifyGetArtistsSpy).not.toHaveBeenCalled()
      expect(findOrCreateSpy).not.toHaveBeenCalled()
      expect(saveSpy).not.toHaveBeenCalled()
    })

    test('should update album with artists if artists are undefined', async () => {
      spotifyGetAlbumSpy.mockResolvedValue(sdkAlbumMock)
      spotifyGetArtistsSpy.mockResolvedValue(sdkArtistsMock)

      // @ts-expect-error - mocking property
      albumMock.artists = undefined

      await albumSubscriber.afterLoad(albumMock)

      expect(spotifyGetAlbumSpy).toHaveBeenCalledWith(
        albumMock.externalId,
        false
      )
      expect(spotifyGetArtistsSpy).toHaveBeenCalledWith(
        sdkAlbumMock.artists.map(({ id }) => id),
        false
      )
      expect(findOrCreateSpy).toHaveBeenCalledWith(
        sdkArtistsMock,
        entityManagerMock
      )
      expect(saveSpy).toHaveBeenCalledWith(albumMock)
    })

    test('should update album with artists if artists are empty', async () => {
      spotifyGetAlbumSpy.mockResolvedValue(sdkAlbumMock)
      spotifyGetArtistsSpy.mockResolvedValue(sdkArtistsMock)

      albumMock.artists = []

      await albumSubscriber.afterLoad(albumMock)

      expect(spotifyGetAlbumSpy).toHaveBeenCalledWith(
        albumMock.externalId,
        false
      )
      expect(spotifyGetArtistsSpy).toHaveBeenCalledWith(
        sdkAlbumMock.artists.map(({ id }) => id),
        false
      )
      expect(findOrCreateSpy).toHaveBeenCalledWith(
        sdkArtistsMock,
        entityManagerMock
      )
      expect(saveSpy).toHaveBeenCalledWith(albumMock)
    })
  })
})
