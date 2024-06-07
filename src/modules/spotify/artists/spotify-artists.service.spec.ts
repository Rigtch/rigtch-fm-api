import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { MockInstance } from 'vitest'
import { Market, SpotifyApi } from '@spotify/web-api-ts-sdk'

import { SpotifyArtistsService } from './spotify-artists.service'

import { AdaptersModule } from '@common/adapters'
import {
  artistMock,
  artistsMock,
  sdkArtistMock,
  sdkArtistsMock,
  sdkTracksMock,
} from '@common/mocks'

vi.mock('@spotify/web-api-ts-sdk', () => {
  const spotifyApiConstructor = vi.fn().mockReturnValue({
    artists: {
      get: vi.fn(),
    },
  })

  return {
    SpotifyApi: Object.assign(spotifyApiConstructor, {
      withClientCredentials: vi.fn().mockReturnThis(),
    }),
  }
})

describe('SpotifyArtistsService', () => {
  let moduleRef: TestingModule
  let spotifyArtistsService: SpotifyArtistsService

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AdaptersModule],
      providers: [
        SpotifyArtistsService,
        {
          provide: ConfigService,
          useValue: {
            get: vi.fn().mockReturnValue('clientId'),
          },
        },
      ],
    }).compile()

    spotifyArtistsService = moduleRef.get(SpotifyArtistsService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(spotifyArtistsService).toBeDefined()
  })

  describe('get', () => {
    let withClientCredentialsSpy: MockInstance
    let getMock: MockInstance

    beforeEach(() => {
      getMock = vi.fn()

      withClientCredentialsSpy = vi
        .spyOn(SpotifyApi, 'withClientCredentials')
        .mockReturnValue({
          artists: {
            get: getMock,
          },
        } as unknown as SpotifyApi)
    })

    describe('getOne', () => {
      const id = 'id'

      test('should return an artist', async () => {
        getMock.mockResolvedValue(sdkArtistMock)

        const artist = await spotifyArtistsService.get(id, false)

        expect(artist).toEqual(sdkArtistMock)

        expect(withClientCredentialsSpy).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(String)
        )
        expect(getMock).toHaveBeenCalledWith(id)
      })

      test('should return an adapted artist', async () => {
        getMock.mockResolvedValue(sdkArtistMock)

        const artist = await spotifyArtistsService.get(id, true)

        expect(artist).toEqual(artistMock)

        expect(withClientCredentialsSpy).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(String)
        )
        expect(getMock).toHaveBeenCalledWith(id)
      })
    })

    describe('getMany', () => {
      test('should return many artists', async () => {
        const ids = sdkArtistsMock.map(artist => artist.id)

        getMock.mockResolvedValue(sdkArtistsMock)

        const artists = await spotifyArtistsService.get(ids, false)

        expect(artists).toEqual(sdkArtistsMock)

        expect(withClientCredentialsSpy).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(String)
        )
        expect(getMock).toHaveBeenCalledWith(ids)
      })

      test('should return many adapted artists', async () => {
        const ids = sdkArtistsMock.map(artist => artist.id)

        getMock.mockResolvedValue(sdkArtistsMock)

        const artists = await spotifyArtistsService.get(ids, true)

        expect(artists).toEqual(artistsMock)

        expect(withClientCredentialsSpy).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(String)
        )
        expect(getMock).toHaveBeenCalledWith(ids)
      })

      test('should get many artists by using chunks', async () => {
        const largeSdkArtistsMock = Array.from(
          { length: 40 },
          () => sdkArtistMock
        )
        const ids = largeSdkArtistsMock.map(artist => artist.id)

        getMock.mockResolvedValueOnce(largeSdkArtistsMock.splice(0, 20))
        getMock.mockResolvedValueOnce(largeSdkArtistsMock.splice(20, 40))

        const artists = await spotifyArtistsService.get(ids, false)

        expect(artists).toEqual(largeSdkArtistsMock)

        expect(withClientCredentialsSpy).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(String)
        )
        expect(getMock).toHaveBeenCalledWith(ids.splice(0, 20))
        expect(getMock).toHaveBeenCalledTimes(2)
      })
    })
  })

  describe('topTracks', () => {
    const artistId = 'id'

    let withClientCredentialsSpy: MockInstance
    let topTracksMock: MockInstance

    beforeEach(() => {
      topTracksMock = vi.fn()

      withClientCredentialsSpy = vi
        .spyOn(SpotifyApi, 'withClientCredentials')
        .mockReturnValue({
          artists: {
            topTracks: topTracksMock,
          },
        } as unknown as SpotifyApi)
    })

    test('should return top tracks', async () => {
      topTracksMock.mockResolvedValue({
        tracks: sdkTracksMock,
      })

      const tracks = await spotifyArtistsService.topTracks(artistId)

      expect(tracks).toEqual(sdkTracksMock)

      expect(withClientCredentialsSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String)
      )
      expect(topTracksMock).toHaveBeenCalledWith(artistId, 'US')
    })

    test('should return top tracks with market', async () => {
      const market: Market = 'PL'

      topTracksMock.mockResolvedValue({
        tracks: sdkTracksMock,
      })

      const tracks = await spotifyArtistsService.topTracks(artistId, market)

      expect(tracks).toEqual(sdkTracksMock)

      expect(withClientCredentialsSpy).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String)
      )
      expect(topTracksMock).toHaveBeenCalledWith(artistId, market)
    })
  })
})
