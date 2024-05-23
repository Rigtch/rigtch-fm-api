import { Test, TestingModule } from '@nestjs/testing'
import { MockInstance } from 'vitest'
import { DataSource, EntityManager, In } from 'typeorm'
import { ConfigService } from '@nestjs/config'

import { TracksService } from './tracks.service'
import { Track } from './track.entity'
import { TracksRepository } from './tracks.repository'

import { Album, AlbumsService } from '@modules/items/albums'
import { Artist } from '@modules/items/artists'
import {
  sdkTrackMock,
  trackEntityMock,
  albumEntityMock,
  artistEntitiesMock,
  entityManagerFactoryMock,
  transactionFactoryMock,
  sdkCreateTrackMock,
  sdkCreateTracksMock,
  trackEntitiesMock,
  sdkAlbumMock,
} from '@common/mocks'
import { EntityManagerCreateMockInstance } from '@common/types/mocks'
import { SpotifyService } from '@modules/spotify'

describe('TracksService', () => {
  let moduleRef: TestingModule
  let entityManagerMock: EntityManager
  let tracksService: TracksService
  let configService: ConfigService
  let spotifyService: SpotifyService
  let tracksRepository: TracksRepository
  let albumsService: AlbumsService

  beforeEach(async () => {
    entityManagerMock = entityManagerFactoryMock()

    moduleRef = await Test.createTestingModule({
      providers: [
        TracksService,
        {
          provide: DataSource,
          useValue: {
            transaction: transactionFactoryMock(entityManagerMock),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: vi.fn(),
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
      ],
    }).compile()

    tracksService = moduleRef.get(TracksService)
    configService = moduleRef.get(ConfigService)
    spotifyService = moduleRef.get(SpotifyService)
    tracksRepository = moduleRef.get(TracksRepository)
    albumsService = moduleRef.get(AlbumsService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(tracksService).toBeDefined()
  })

  describe('onModuleInit', () => {
    let getConfigSpy: MockInstance
    let getTrackSpy: MockInstance
    let getAlbumSpy: MockInstance
    let findTracksSpy: MockInstance
    let saveSpy: MockInstance
    let updateOrCreateSpy: MockInstance

    beforeEach(() => {
      getConfigSpy = vi.spyOn(configService, 'get')
      getTrackSpy = vi.spyOn(spotifyService.tracks, 'get')
      getAlbumSpy = vi.spyOn(spotifyService.albums, 'get')
      findTracksSpy = vi.spyOn(tracksRepository, 'findTracks')
      saveSpy = vi.spyOn(tracksRepository, 'save')
      updateOrCreateSpy = vi.spyOn(albumsService, 'updateOrCreate')
    })

    test('should not check tracks if not enabled', async () => {
      getConfigSpy.mockReturnValue(false)

      await tracksService.onModuleInit()

      expect(getConfigSpy).toHaveBeenCalled()
      expect(getTrackSpy).not.toHaveBeenCalled()
      expect(getAlbumSpy).not.toHaveBeenCalled()
      expect(findTracksSpy).not.toHaveBeenCalled()
      expect(saveSpy).not.toHaveBeenCalled()
      expect(updateOrCreateSpy).not.toHaveBeenCalled()
    })

    test('should check tracks if enabled', async () => {
      getConfigSpy.mockReturnValue(true)
      findTracksSpy.mockResolvedValue(trackEntitiesMock)

      await tracksService.onModuleInit()

      expect(getConfigSpy).toHaveBeenCalled()
      expect(getTrackSpy).not.toHaveBeenCalled()
      expect(getAlbumSpy).not.toHaveBeenCalled()
      expect(findTracksSpy).toHaveBeenCalled()
      expect(saveSpy).not.toHaveBeenCalled()
      expect(updateOrCreateSpy).not.toHaveBeenCalled()
    })

    test('should update track album if is nullish', async () => {
      const externalId = 'externalId'

      const brokenTrack = {
        ...trackEntityMock,
        externalId,
        album: undefined,
      }

      getConfigSpy.mockReturnValue(true)
      findTracksSpy.mockResolvedValue([...trackEntitiesMock, brokenTrack])
      getTrackSpy.mockResolvedValue(sdkTrackMock)
      getAlbumSpy.mockResolvedValue(sdkAlbumMock)

      await tracksService.onModuleInit()

      expect(getConfigSpy).toHaveBeenCalled()
      expect(getTrackSpy).toHaveBeenCalledWith(externalId, false)
      expect(getAlbumSpy).toHaveBeenCalledWith(sdkTrackMock.album.id, false)
      expect(findTracksSpy).toHaveBeenCalled()
      expect(saveSpy).toHaveBeenCalledWith(brokenTrack)
      expect(updateOrCreateSpy).toHaveBeenCalledWith(sdkAlbumMock)
    })
  })

  describe('updateOrCreate', () => {
    describe('updateOrCreateOne', () => {
      let findOneBySpy: MockInstance

      beforeEach(() => {
        findOneBySpy = vi.spyOn(entityManagerMock, 'findOneBy')
      })

      test('should update track if found', async () => {
        findOneBySpy.mockResolvedValue(trackEntityMock)

        expect(await tracksService.updateOrCreate(sdkCreateTrackMock)).toEqual(
          trackEntityMock
        )
        expect(findOneBySpy).toHaveBeenCalledWith(Track, {
          externalId: sdkTrackMock.id,
        })
      })

      test('should create track if not found', async () => {
        findOneBySpy
          .mockResolvedValueOnce(null)
          .mockResolvedValue(albumEntityMock)
        const findBySpy = vi
          .spyOn(entityManagerMock, 'findBy')
          .mockResolvedValue(artistEntitiesMock)
        const createSpy = (
          vi.spyOn(
            entityManagerMock,
            'create'
          ) as EntityManagerCreateMockInstance
        ).mockReturnValue(trackEntityMock)
        const saveSpy = vi
          .spyOn(entityManagerMock, 'save')
          .mockResolvedValue(trackEntityMock)

        expect(await tracksService.updateOrCreate(sdkCreateTrackMock)).toEqual(
          trackEntityMock
        )
        expect(createSpy).toHaveBeenCalledWith(Track, {
          name: sdkTrackMock.name,
          externalId: sdkTrackMock.id,
          href: sdkTrackMock.external_urls.spotify,
          duration: sdkTrackMock.duration_ms,
          album: albumEntityMock,
          artists: artistEntitiesMock,
        })
        expect(saveSpy).toHaveBeenCalledWith(trackEntityMock)
        expect(findOneBySpy).toHaveBeenCalledWith(Track, {
          externalId: sdkTrackMock.id,
        })
        expect(findOneBySpy).toHaveBeenCalledWith(Album, {
          externalId: sdkTrackMock.album.id,
        })
        expect(findOneBySpy).toHaveBeenCalledTimes(2)
        expect(findBySpy).toHaveBeenCalledWith(Artist, {
          externalId: In(
            artistEntitiesMock.map(({ externalId }) => externalId)
          ),
        })
      })
    })

    describe('updateOrCreateMany', () => {
      test('should update or create many tracks', async () => {
        const updateOrCreateOneSpy = vi
          .spyOn(tracksService as never, 'updateOrCreateOne')
          .mockResolvedValue(trackEntityMock)

        expect(await tracksService.updateOrCreate(sdkCreateTracksMock)).toEqual(
          trackEntitiesMock
        )
        expect(updateOrCreateOneSpy).toHaveBeenCalledWith(sdkCreateTrackMock)
        expect(updateOrCreateOneSpy).toHaveBeenCalledTimes(5)
      })
    })
  })
})
