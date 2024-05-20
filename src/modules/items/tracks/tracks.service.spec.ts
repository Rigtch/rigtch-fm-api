import { Test, TestingModule } from '@nestjs/testing'
import { MockInstance } from 'vitest'
import { DataSource, EntityManager, In } from 'typeorm'

import { TracksService } from './tracks.service'
import { Track } from './track.entity'

import { Album } from '@modules/items/albums'
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
} from '@common/mocks'
import { EntityManagerCreateMockInstance } from '@common/types/mocks'

describe('TracksService', () => {
  let moduleRef: TestingModule
  let entityManagerMock: EntityManager
  let tracksService: TracksService

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
      ],
    }).compile()

    tracksService = moduleRef.get(TracksService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(tracksService).toBeDefined()
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
