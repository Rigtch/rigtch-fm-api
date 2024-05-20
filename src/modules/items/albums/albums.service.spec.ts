import { Test, TestingModule } from '@nestjs/testing'
import { MockInstance } from 'vitest'
import { DataSource, EntityManager, In, UpdateResult } from 'typeorm'
import { mock } from 'vitest-mock-extended'

import { AlbumsService } from './albums.service'
import { Album } from './album.entity'

import { TracksService } from '@modules/items/tracks'
import {
  albumEntityMock,
  sdkAlbumMock,
  imagesMock,
  artistEntitiesMock,
  sdkArtistsMock,
  entityManagerFactoryMock,
  transactionFactoryMock,
  sdkAlbumsMock,
  albumsEntitiesMock,
} from '@common/mocks'
import { SdkAlbum } from '@common/types/spotify'
import { Artist } from '@modules/items/artists'
import { EntityManagerCreateMockInstance } from '@common/types/mocks'
import { Image } from '@modules/images'

type GetAlbumMockInstance = MockInstance<
  [id: string, adapt: false],
  Promise<SdkAlbum>
>
type GetAlbumsMockInstance = MockInstance<
  [ids: string[], adapt: false],
  Promise<SdkAlbum[]>
>

describe('AlbumsService', () => {
  let moduleRef: TestingModule
  let entityManagerMock: EntityManager
  let albumsService: AlbumsService
  let tracksService: TracksService

  beforeEach(async () => {
    entityManagerMock = entityManagerFactoryMock()

    moduleRef = await Test.createTestingModule({
      providers: [
        AlbumsService,
        {
          provide: DataSource,
          useValue: {
            transaction: transactionFactoryMock(entityManagerMock),
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

    albumsService = moduleRef.get(AlbumsService)
    tracksService = moduleRef.get(TracksService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  describe('updateOrCreate', () => {
    describe('updateOrCreateOne', () => {
      let findOneBySpy: MockInstance
      let tracksUpdateOrCreate: MockInstance

      beforeEach(() => {
        findOneBySpy = vi.spyOn(entityManagerMock, 'findOneBy')
        tracksUpdateOrCreate = vi.spyOn(tracksService, 'updateOrCreate')
      })

      test('should update album if found', async () => {
        findOneBySpy
          .mockResolvedValueOnce(albumEntityMock)
          .mockResolvedValue(albumEntityMock)
        const updateSpy = vi
          .spyOn(entityManagerMock, 'update')
          .mockResolvedValue(mock<UpdateResult>())

        expect(await albumsService.updateOrCreate(sdkAlbumMock)).toEqual(
          albumEntityMock
        )
        expect(findOneBySpy).toHaveBeenCalledWith(Album, {
          externalId: sdkAlbumMock.id,
        })
        expect(findOneBySpy).toHaveBeenCalledTimes(2)
        expect(updateSpy).toHaveBeenCalledWith(
          Album,
          { externalId: sdkAlbumMock.id },
          {
            name: sdkAlbumMock.name,
            externalId: sdkAlbumMock.id,
            href: sdkAlbumMock.external_urls.spotify,
            albumType: sdkAlbumMock.album_type,
            releaseDate: new Date(sdkAlbumMock.release_date),
            totalTracks: sdkAlbumMock.total_tracks,
          }
        )
        expect(tracksUpdateOrCreate).toHaveBeenCalled()
      })

      test('should create album if not found', async () => {
        findOneBySpy.mockResolvedValue(null)
        const findBySpy = vi
          .spyOn(entityManagerMock, 'findBy')
          .mockResolvedValueOnce(imagesMock)
          .mockResolvedValueOnce(artistEntitiesMock)
        const createSpy = (
          vi.spyOn(
            entityManagerMock,
            'create'
          ) as EntityManagerCreateMockInstance
        ).mockReturnValue(albumEntityMock)
        const saveSpy = vi
          .spyOn(entityManagerMock, 'save')
          .mockResolvedValue(albumEntityMock)

        expect(await albumsService.updateOrCreate(sdkAlbumMock)).toEqual(
          albumEntityMock
        )
        expect(findOneBySpy).toHaveBeenCalledWith(Album, {
          externalId: sdkAlbumMock.id,
        })
        expect(findBySpy).toHaveBeenCalledWith(Artist, {
          externalId: In(sdkArtistsMock.map(({ id }) => id)),
        })
        expect(findBySpy).toHaveBeenCalledWith(Image, {
          url: In(imagesMock.map(({ url }) => url)),
        })
        expect(findBySpy).toHaveBeenCalledTimes(2)
        expect(createSpy).toHaveBeenCalledWith(Album, {
          name: sdkAlbumMock.name,
          externalId: sdkAlbumMock.id,
          href: sdkAlbumMock.external_urls.spotify,
          albumType: sdkAlbumMock.album_type,
          releaseDate: new Date(sdkAlbumMock.release_date),
          totalTracks: sdkAlbumMock.total_tracks,
          images: imagesMock,
          artists: artistEntitiesMock,
        })
        expect(saveSpy).toHaveBeenCalled()
        expect(tracksUpdateOrCreate).toHaveBeenCalled()
      })
    })

    describe('updateOrCreateMany', () => {
      test('should update or create many albums', async () => {
        const updateOrCreateOneSpy = vi
          .spyOn(albumsService as never, 'updateOrCreateOne')
          .mockResolvedValue(albumEntityMock)

        expect(await albumsService.updateOrCreate(sdkAlbumsMock)).toEqual(
          albumsEntitiesMock
        )
        expect(updateOrCreateOneSpy).toHaveBeenCalledWith(sdkAlbumMock)
        expect(updateOrCreateOneSpy).toHaveBeenCalledTimes(5)
      })
    })
  })
})
