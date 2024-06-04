import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'
import { MockInstance } from 'vitest'

import { TracksService } from '../tracks'

import { AlbumsValidator } from './albums.validator'
import { AlbumsRepository } from './albums.repository'

import {
  sdkTracksMock,
  trackEntitiesMock,
  albumEntityMock,
  albumsEntitiesMock,
  sdkAlbumMock,
} from '@common/mocks'
import { SpotifyService } from '@modules/spotify'

describe('AlbumsValidator', () => {
  let moduleRef: TestingModule
  let configService: ConfigService
  let albumsValidator: AlbumsValidator
  let albumsRepository: AlbumsRepository
  let spotifyService: SpotifyService
  let tracksService: TracksService

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        AlbumsValidator,
        {
          provide: ConfigService,
          useValue: {
            get: vi.fn(),
          },
        },
        {
          provide: AlbumsRepository,
          useValue: {
            findAlbums: vi.fn(),
            save: vi.fn(),
          },
        },
        {
          provide: SpotifyService,
          useValue: {
            albums: {
              get: vi.fn(),
            },
            tracks: {
              get: vi.fn(),
            },
          },
        },
        {
          provide: TracksService,
          useValue: {
            updateOrCreate: vi.fn(),
          },
        },
      ],
    }).compile()

    configService = moduleRef.get(ConfigService)
    albumsValidator = moduleRef.get(AlbumsValidator)
    albumsRepository = moduleRef.get(AlbumsRepository)
    spotifyService = moduleRef.get(SpotifyService)
    tracksService = moduleRef.get(TracksService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(albumsValidator).toBeDefined()
  })

  describe('onModuleInit', () => {
    let findAlbumsSpy: MockInstance
    let getConfigSpy: MockInstance
    let getAlbumSpy: MockInstance
    let saveSpy: MockInstance

    beforeEach(() => {
      findAlbumsSpy = vi.spyOn(albumsRepository, 'findAlbums')
      getConfigSpy = vi.spyOn(configService, 'get')
      saveSpy = vi.spyOn(albumsRepository, 'save')
      getAlbumSpy = vi.spyOn(spotifyService.albums, 'get')
    })

    test('should return if validation is disabled', async () => {
      getConfigSpy.mockReturnValue(false)

      await albumsValidator.onModuleInit()

      expect(findAlbumsSpy).not.toHaveBeenCalled()
    })

    describe('validateTracksExistence', () => {
      let getTracksSpy: MockInstance
      let updateOrCreateSpy: MockInstance

      beforeEach(() => {
        vi.spyOn(
          albumsValidator as never,
          'validateReleaseDatePrecision'
        ).mockResolvedValue(null)

        getTracksSpy = vi.spyOn(spotifyService.tracks, 'get')
        updateOrCreateSpy = vi.spyOn(tracksService, 'updateOrCreate')

        getConfigSpy.mockReturnValue(true)
      })

      test('should return if tracks exists', async () => {
        findAlbumsSpy.mockReturnValue(albumsEntitiesMock)

        await albumsValidator.onModuleInit()

        expect(findAlbumsSpy).toHaveBeenCalled()
        expect(getAlbumSpy).not.toHaveBeenCalled()
        expect(getTracksSpy).not.toHaveBeenCalled()
        expect(updateOrCreateSpy).not.toHaveBeenCalled()
        expect(saveSpy).not.toHaveBeenCalled()
      })

      test('should update album with tracks', async () => {
        findAlbumsSpy.mockReturnValue([
          {
            ...albumEntityMock,
            tracks: [],
          },
        ])
        getAlbumSpy.mockReturnValue(sdkAlbumMock)
        getTracksSpy.mockReturnValue(sdkTracksMock)
        updateOrCreateSpy.mockReturnValue(trackEntitiesMock)
        saveSpy.mockReturnValue(albumEntityMock)

        await albumsValidator.onModuleInit()

        expect(findAlbumsSpy).toHaveBeenCalled()
        expect(getAlbumSpy).toHaveBeenCalledWith(albumEntityMock.id, false)
        expect(getTracksSpy).toHaveBeenCalledWith(
          sdkAlbumMock.tracks.items.map(({ id }) => id),
          false
        )
        expect(updateOrCreateSpy).toHaveBeenCalled()
        expect(saveSpy).toHaveBeenCalled()
      })
    })

    describe('validateReleaseDatePrecision', () => {
      beforeEach(() => {
        getConfigSpy.mockReturnValue(true)
      })

      test('should return if release date precision exists', async () => {
        findAlbumsSpy.mockReturnValue(albumsEntitiesMock)

        await albumsValidator.onModuleInit()

        expect(findAlbumsSpy).toHaveBeenCalled()
        expect(getAlbumSpy).not.toHaveBeenCalled()
        expect(saveSpy).not.toHaveBeenCalled()
      })

      test('should update album with release date precision', async () => {
        findAlbumsSpy.mockReturnValue([
          {
            ...albumEntityMock,
            releaseDatePrecision: null,
          },
        ])
        getAlbumSpy.mockReturnValue(sdkAlbumMock)
        saveSpy.mockReturnValue(albumEntityMock)

        await albumsValidator.onModuleInit()

        expect(findAlbumsSpy).toHaveBeenCalled()
        expect(getAlbumSpy).toHaveBeenCalledWith(albumEntityMock.id, false)
        expect(saveSpy).toHaveBeenCalled()
      })
    })
  })
})
