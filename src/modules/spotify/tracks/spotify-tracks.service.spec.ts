import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { MockInstance } from 'vitest'
import { SpotifyApi } from '@spotify/web-api-ts-sdk'

import { SpotifyTracksService } from './spotify-tracks.service'

import { AdaptersModule } from '@common/adapters'
import {
  sdkTrackMock,
  sdkTracksMock,
  trackMock,
  tracksMock,
} from '@common/mocks'

vi.mock('@spotify/web-api-ts-sdk', () => {
  const spotifyApiConstructor = vi.fn().mockReturnValue({
    tracks: {
      get: vi.fn(),
    },
  })

  return {
    SpotifyApi: Object.assign(spotifyApiConstructor, {
      withClientCredentials: vi.fn().mockReturnThis(),
    }),
  }
})

describe('SpotifyTracksService', () => {
  let moduleRef: TestingModule
  let spotifyTracksService: SpotifyTracksService

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AdaptersModule],
      providers: [
        SpotifyTracksService,
        {
          provide: ConfigService,
          useValue: {
            get: vi.fn().mockReturnValue('clientId'),
          },
        },
      ],
    }).compile()

    spotifyTracksService = moduleRef.get(SpotifyTracksService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(spotifyTracksService).toBeDefined()
  })

  describe('get', () => {
    let withClientCredentialsSpy: MockInstance
    let getMock: MockInstance

    beforeEach(() => {
      getMock = vi.fn()

      withClientCredentialsSpy = vi
        .spyOn(SpotifyApi, 'withClientCredentials')
        .mockReturnValue({
          tracks: {
            get: getMock,
          },
        } as unknown as SpotifyApi)
    })

    describe('getOne', () => {
      const id = 'id'

      test('should return a track', async () => {
        getMock.mockResolvedValue(sdkTrackMock)

        const track = await spotifyTracksService.get(id, false)

        expect(track).toEqual(sdkTrackMock)

        expect(withClientCredentialsSpy).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(String)
        )
        expect(getMock).toHaveBeenCalledWith(id)
      })

      test('should return an adapted track', async () => {
        getMock.mockResolvedValue(sdkTrackMock)

        const track = await spotifyTracksService.get(id, true)

        expect(track).toEqual(trackMock)

        expect(withClientCredentialsSpy).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(String)
        )
        expect(getMock).toHaveBeenCalledWith(id)
      })
    })

    describe('getMany', () => {
      test('should return many tracks', async () => {
        const ids = sdkTracksMock.map(track => track.id)

        getMock.mockResolvedValue(sdkTracksMock)

        const tracks = await spotifyTracksService.get(ids, false)

        expect(tracks).toEqual(sdkTracksMock)

        expect(withClientCredentialsSpy).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(String)
        )
        expect(getMock).toHaveBeenCalledWith(ids)
      })

      test('should return many adapted tracks', async () => {
        const ids = sdkTracksMock.map(track => track.id)

        getMock.mockResolvedValue(sdkTracksMock)

        const tracks = await spotifyTracksService.get(ids, true)

        expect(tracks).toEqual(tracksMock)

        expect(withClientCredentialsSpy).toHaveBeenCalledWith(
          expect.any(String),
          expect.any(String)
        )
        expect(getMock).toHaveBeenCalledWith(ids)
      })

      test('should get many by using chunks', async () => {
        const largeSdkTracksMock = Array.from(
          { length: 40 },
          () => sdkTrackMock
        )
        const ids = largeSdkTracksMock.map(track => track.id)

        getMock.mockResolvedValueOnce(largeSdkTracksMock.splice(0, 20))
        getMock.mockResolvedValueOnce(largeSdkTracksMock.splice(20, 40))

        const tracks = await spotifyTracksService.get(ids, false)

        expect(tracks).toEqual(largeSdkTracksMock)

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
