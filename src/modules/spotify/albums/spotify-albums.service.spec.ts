import { Test, TestingModule } from '@nestjs/testing'
import { SpotifyApi } from '@spotify/web-api-ts-sdk'
import { MockInstance } from 'vitest'

import { SpotifyAlbumsService } from './spotify-albums.service'

import { EnvService } from '@config/env'
import { AdaptersModule } from '@common/adapters'
import {
  albumMock,
  albumsMock,
  pageMockFactory,
  sdkAlbumMock,
  sdkAlbumsMock,
  sdkSimplifiedTrackMock,
} from '@common/mocks'

vi.mock('@spotify/web-api-ts-sdk', () => {
  const spotifyApiConstructor = vi.fn().mockReturnValue({
    albums: {
      get: vi.fn(),
    },
  })

  return {
    SpotifyApi: Object.assign(spotifyApiConstructor, {
      withClientCredentials: vi.fn().mockReturnThis(),
    }),
  }
})

describe('SpotifyAlbumsService', () => {
  let moduleRef: TestingModule
  let spotifyAlbumsService: SpotifyAlbumsService

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AdaptersModule],
      providers: [
        SpotifyAlbumsService,

        {
          provide: EnvService,
          useValue: {
            get: vi.fn().mockReturnValue('clientId'),
          },
        },
      ],
    }).compile()

    spotifyAlbumsService = moduleRef.get(SpotifyAlbumsService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(spotifyAlbumsService).toBeDefined()
  })

  describe('get', () => {
    let withClientCredentialsSpy: MockInstance
    let getMock: MockInstance
    let getTracksMock: MockInstance

    beforeEach(() => {
      getMock = vi.fn()
      getTracksMock = vi.fn()

      withClientCredentialsSpy = vi
        .spyOn(SpotifyApi, 'withClientCredentials')
        .mockReturnValue({
          albums: {
            get: getMock,
            tracks: getTracksMock,
          },
        } as unknown as SpotifyApi)
    })

    describe('getOne', () => {
      const id = 'id'

      test('should return an album', async () => {
        getMock.mockResolvedValue(sdkAlbumMock)

        const album = await spotifyAlbumsService.get(id, false)

        expect(album).toEqual(sdkAlbumMock)

        expect(withClientCredentialsSpy).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(String)
        )
        expect(getMock).toHaveBeenCalledWith(id)
      })

      test('should return an adapted album', async () => {
        getMock.mockResolvedValue(sdkAlbumMock)

        const album = await spotifyAlbumsService.get(id, true)

        expect(album).toEqual(albumMock)

        expect(withClientCredentialsSpy).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(String)
        )
        expect(getMock).toHaveBeenCalledWith(id)
      })

      test('should return album with missing tracks', async () => {
        const totalTracks = sdkAlbumMock.total_tracks + 2

        getMock.mockResolvedValue({
          ...sdkAlbumMock,
          tracks: {
            ...sdkAlbumMock.tracks,
            total: totalTracks,
          },
          total_tracks: totalTracks,
        })
        getTracksMock.mockResolvedValue(
          pageMockFactory(
            [sdkSimplifiedTrackMock, sdkSimplifiedTrackMock],
            totalTracks
          )
        )

        const album = await spotifyAlbumsService.get(id, false)

        expect(album.tracks.items.length).toEqual(totalTracks)
        expect(album.name).toEqual(albumMock.name)
      })
    })

    describe('getMany', () => {
      test('should return many albums', async () => {
        const ids = sdkAlbumsMock.map(album => album.id)

        getMock.mockResolvedValue(sdkAlbumsMock)

        const albums = await spotifyAlbumsService.get(ids, false)

        expect(albums).toEqual(sdkAlbumsMock)

        expect(withClientCredentialsSpy).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(String)
        )
        expect(getMock).toHaveBeenCalledWith(ids)
      })

      test('should return many adapted albums', async () => {
        const ids = sdkAlbumsMock.map(album => album.id)

        getMock.mockResolvedValue(sdkAlbumsMock)

        const albums = await spotifyAlbumsService.get(ids, true)

        expect(albums.map(({ tracks, ...album }) => album)).toEqual(
          albumsMock.map(({ tracks, ...album }) => album)
        )

        expect(withClientCredentialsSpy).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(String)
        )
        expect(getMock).toHaveBeenCalledWith(ids)
      })

      test('should get many by using chunks', async () => {
        const largeSdkAlbumsMock = Array.from(
          { length: 40 },
          () => sdkAlbumMock
        )
        const ids = largeSdkAlbumsMock.map(album => album.id)

        getMock.mockResolvedValueOnce(largeSdkAlbumsMock.splice(0, 20))
        getMock.mockResolvedValueOnce(largeSdkAlbumsMock.splice(20, 40))

        const albums = await spotifyAlbumsService.get(ids, false)

        expect(albums).toEqual(largeSdkAlbumsMock)

        expect(withClientCredentialsSpy).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(String)
        )
        expect(getMock).toHaveBeenCalledWith(ids.splice(0, 20))
        expect(getMock).toHaveBeenCalledTimes(2)
      })
    })
  })
})
