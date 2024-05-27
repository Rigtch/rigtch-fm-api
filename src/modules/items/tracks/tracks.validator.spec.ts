import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { MockInstance } from 'vitest'

import { AlbumsService } from '../albums'

import { TracksRepository } from './tracks.repository'
import { TracksValidator } from './tracks.validator'

import { SpotifyService } from '@modules/spotify'
import {
  albumEntityMock,
  sdkAlbumMock,
  sdkTrackMock,
  trackEntitiesMock,
  trackEntityMock,
} from '@common/mocks'

describe('TracksValidator', () => {
  let moduleRef: TestingModule
  let tracksValidator: TracksValidator
  let tracksRepository: TracksRepository
  let configService: ConfigService
  let albumsService: AlbumsService
  let spotifyService: SpotifyService

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        TracksValidator,
        {
          provide: ConfigService,
          useValue: {
            get: vi.fn(),
          },
        },
        {
          provide: TracksRepository,
          useValue: {
            findTracks: vi.fn(),
            save: vi.fn(),
          },
        },
        {
          provide: AlbumsService,
          useValue: {
            updateOrCreate: vi.fn(),
          },
        },
        {
          provide: SpotifyService,
          useValue: {
            tracks: {
              get: vi.fn(),
            },
            albums: {
              get: vi.fn(),
            },
          },
        },
      ],
    }).compile()

    tracksValidator = moduleRef.get(TracksValidator)
    configService = moduleRef.get(ConfigService)
    tracksRepository = moduleRef.get(TracksRepository)
    albumsService = moduleRef.get(AlbumsService)
    spotifyService = moduleRef.get(SpotifyService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(tracksValidator).toBeDefined()
  })

  describe('onModuleInit', () => {
    let findTracksSpy: MockInstance
    let getConfigSpy: MockInstance
    let saveSpy: MockInstance
    let getTrackSpy: MockInstance

    beforeEach(() => {
      findTracksSpy = vi.spyOn(tracksRepository, 'findTracks')
      getConfigSpy = vi.spyOn(configService, 'get')
      saveSpy = vi.spyOn(tracksRepository, 'save')
      getTrackSpy = vi.spyOn(spotifyService.tracks, 'get')
    })

    test('should return if validation is disabled', async () => {
      getConfigSpy.mockReturnValue(false)

      await tracksValidator.onModuleInit()

      expect(findTracksSpy).not.toHaveBeenCalled()
    })

    describe('validateAlbumExistence', () => {
      let getAlbumSpy: MockInstance
      let updateOrCreateSpy: MockInstance

      beforeEach(() => {
        getAlbumSpy = vi.spyOn(spotifyService.albums, 'get')
        updateOrCreateSpy = vi.spyOn(albumsService, 'updateOrCreate')

        getConfigSpy.mockReturnValue(true)
      })

      test('should validate tracks album', async () => {
        findTracksSpy.mockResolvedValue(trackEntitiesMock)

        await tracksValidator.onModuleInit()

        expect(getConfigSpy).toHaveBeenCalled()
        expect(getTrackSpy).not.toHaveBeenCalled()
        expect(getAlbumSpy).not.toHaveBeenCalled()
        expect(findTracksSpy).toHaveBeenCalled()
        expect(saveSpy).not.toHaveBeenCalled()
        expect(updateOrCreateSpy).not.toHaveBeenCalled()
      })

      test('should update the album of the track if is nullish', async () => {
        const externalId = 'externalId'

        const brokenTrack = {
          ...trackEntityMock,
          externalId,
          album: undefined,
        }

        findTracksSpy.mockResolvedValue([...trackEntitiesMock, brokenTrack])
        getTrackSpy.mockResolvedValue(sdkTrackMock)
        getAlbumSpy.mockResolvedValue(sdkAlbumMock)
        updateOrCreateSpy.mockResolvedValue(albumEntityMock)

        await tracksValidator.onModuleInit()

        expect(getConfigSpy).toHaveBeenCalled()
        expect(getTrackSpy).toHaveBeenCalledWith(externalId, false)
        expect(findTracksSpy).toHaveBeenCalled()
      })
    })

    describe('validateTrackNumberAndDiscNumber', () => {
      beforeEach(() => {
        getConfigSpy.mockReturnValue(true)
      })

      test('should validate tracks trackNumber and discNumber', async () => {
        findTracksSpy.mockResolvedValue(trackEntitiesMock)

        await tracksValidator.onModuleInit()

        expect(getConfigSpy).toHaveBeenCalled()
        expect(getTrackSpy).not.toHaveBeenCalled()
        expect(findTracksSpy).toHaveBeenCalled()
        expect(saveSpy).not.toHaveBeenCalled()
      })

      test('should update the trackNumber and discNumber of the track if is nullish', async () => {
        const externalId = 'externalId'

        const brokenTrack = {
          ...trackEntityMock,
          externalId,
          trackNumber: null,
          discNumber: null,
        }

        findTracksSpy.mockResolvedValue([...trackEntitiesMock, brokenTrack])
        getTrackSpy.mockResolvedValue(sdkTrackMock)

        await tracksValidator.onModuleInit()

        expect(getConfigSpy).toHaveBeenCalled()
        expect(getTrackSpy).toHaveBeenCalledWith(externalId, false)
        expect(findTracksSpy).toHaveBeenCalled()
      })
    })
  })
})
