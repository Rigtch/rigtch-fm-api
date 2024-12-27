import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { PaginateQuery } from 'nestjs-paginate'
import { MockInstance } from 'vitest'

import { ArtistsRepository } from '../artists.repository'

import { ArtistsController } from './artists.controller'

import {
  albumsEntitiesMock,
  artistEntityMock,
  createQueryBuilderFactoryMock,
  createQueryBuilderMockImplementation,
  sdkAlbumsMock,
  sdkTracksMock,
  trackEntitiesMock,
} from '@common/mocks'
import { SpotifyService } from '@modules/spotify'
import { ItemsService } from '@modules/items/items.service'

describe('ArtistsController', () => {
  let moduleRef: TestingModule
  let artistsController: ArtistsController
  let artistsRepository: ArtistsRepository
  let spotifyService: SpotifyService
  let itemsService: ItemsService

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [ArtistsController],
      providers: [
        {
          provide: ArtistsRepository,
          useValue: {
            createQueryBuilder: createQueryBuilderFactoryMock(artistEntityMock),
            findOneBy: vi.fn(),
          },
        },
        {
          provide: SpotifyService,
          useValue: {
            artists: {
              topTracks: vi.fn(),
              albums: vi.fn(),
            },
          },
        },
        {
          provide: ItemsService,
          useValue: {
            findOrCreate: vi.fn(),
          },
        },
      ],
    }).compile()

    artistsController = moduleRef.get(ArtistsController)
    artistsRepository = moduleRef.get(ArtistsRepository)
    spotifyService = moduleRef.get(SpotifyService)
    itemsService = moduleRef.get(ItemsService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(artistsController).toBeDefined()
  })

  describe('getArtists', () => {
    let paginateQueryMock: PaginateQuery

    beforeEach(() => {
      paginateQueryMock = {
        path: '',
      }
    })

    test('should get paginated artists', async () => {
      const response = await artistsController.getArtists(paginateQueryMock)

      expect(response.data).toEqual(artistEntityMock)
      expect(response.meta.itemsPerPage).toEqual(10)
      expect(response.meta.currentPage).toEqual(1)
    })

    test('should get paginated artists with limit', async () => {
      const limit = 50

      paginateQueryMock.limit = limit

      const response = await artistsController.getArtists(paginateQueryMock)

      expect(response.data).toEqual(artistEntityMock)
      expect(response.meta.itemsPerPage).toEqual(limit)
      expect(response.meta.currentPage).toEqual(1)
    })

    test('should get paginated artists with page', async () => {
      const page = 2

      paginateQueryMock.page = page

      const response = await artistsController.getArtists(paginateQueryMock)

      expect(response.data).toEqual(artistEntityMock)
      expect(response.meta.itemsPerPage).toEqual(10)
      expect(response.meta.currentPage).toEqual(page)
    })
  })

  describe('getArtistById', () => {
    const id = 'id'

    let createQueryBuilderSpy: MockInstance

    beforeEach(() => {
      createQueryBuilderSpy = vi.spyOn(artistsRepository, 'createQueryBuilder')
    })

    test('should get artist by id', async () => {
      createQueryBuilderSpy.mockReturnValue(
        createQueryBuilderMockImplementation(artistEntityMock)
      )

      expect(await artistsController.getArtistById(id)).toEqual(
        artistEntityMock
      )
      expect(createQueryBuilderSpy).toHaveBeenCalledWith('artist')
    })

    test('should throw not found exception', async () => {
      createQueryBuilderSpy.mockReturnValue(
        createQueryBuilderMockImplementation(null)
      )

      await expect(artistsController.getArtistById(id)).rejects.toThrowError(
        NotFoundException
      )
      expect(createQueryBuilderSpy).toHaveBeenCalledWith('artist')
    })
  })

  describe('getArtistTopTracks', () => {
    const id = 'id'

    let findOneBySpy: MockInstance
    let topTracksSpy: MockInstance
    let findOrCreateSpy: MockInstance

    beforeEach(() => {
      findOneBySpy = vi.spyOn(artistsRepository, 'findOneBy')
      topTracksSpy = vi.spyOn(spotifyService.artists, 'topTracks')
      findOrCreateSpy = vi.spyOn(itemsService, 'findOrCreate')
    })

    test('should get artist top tracks by id', async () => {
      findOneBySpy.mockReturnValue(artistEntityMock)
      topTracksSpy.mockReturnValue(sdkTracksMock)
      findOrCreateSpy.mockReturnValue(trackEntitiesMock)

      expect(await artistsController.getArtistTopTracks(id, {})).toEqual({
        tracks: trackEntitiesMock,
      })

      expect(findOneBySpy).toHaveBeenCalledWith({
        id,
      })
      expect(topTracksSpy).toHaveBeenCalledWith(artistEntityMock.externalId)
      expect(findOrCreateSpy).toHaveBeenCalledWith(sdkTracksMock)
    })

    test('should get artist top tracks by id with limit', async () => {
      const limit = 10

      findOneBySpy.mockReturnValue(artistEntityMock)
      topTracksSpy.mockReturnValue(sdkTracksMock)
      findOrCreateSpy.mockReturnValue(trackEntitiesMock)

      expect(await artistsController.getArtistTopTracks(id, { limit })).toEqual(
        {
          tracks: trackEntitiesMock.slice(0, limit),
        }
      )

      expect(findOneBySpy).toHaveBeenCalledWith({
        id,
      })
      expect(topTracksSpy).toHaveBeenCalledWith(artistEntityMock.externalId)
      expect(findOrCreateSpy).toHaveBeenCalledWith(sdkTracksMock)
    })

    test('should throw not found exception', async () => {
      findOneBySpy.mockReturnValue(null)

      await expect(
        artistsController.getArtistTopTracks(id, {})
      ).rejects.toThrowError(NotFoundException)

      expect(findOneBySpy).toHaveBeenCalledWith({
        id,
      })
      expect(topTracksSpy).not.toHaveBeenCalled()
      expect(findOrCreateSpy).not.toHaveBeenCalled()
    })
  })

  describe('getArtistAlbums', () => {
    const id = 'id'

    let findOneBySpy: MockInstance
    let albumsSpy: MockInstance
    let findOrCreateSpy: MockInstance

    beforeEach(() => {
      findOneBySpy = vi.spyOn(artistsRepository, 'findOneBy')
      albumsSpy = vi.spyOn(spotifyService.artists, 'albums')
      findOrCreateSpy = vi.spyOn(itemsService, 'findOrCreate')
    })

    test('should get artist albums by id', async () => {
      findOneBySpy.mockReturnValue(artistEntityMock)
      albumsSpy.mockReturnValue(sdkAlbumsMock)
      findOrCreateSpy.mockReturnValue(albumsEntitiesMock)

      expect(await artistsController.getArtistAlbums(id)).toEqual({
        albums: albumsEntitiesMock,
      })

      expect(findOneBySpy).toHaveBeenCalledWith({
        id,
      })
      expect(albumsSpy).toHaveBeenCalledWith(artistEntityMock.externalId)
      expect(findOrCreateSpy).toHaveBeenCalledWith(sdkAlbumsMock)
    })

    test('should throw not found exception', async () => {
      findOneBySpy.mockReturnValue(null)

      await expect(artistsController.getArtistAlbums(id)).rejects.toThrowError(
        NotFoundException
      )

      expect(findOneBySpy).toHaveBeenCalledWith({
        id,
      })
      expect(albumsSpy).not.toHaveBeenCalled()
      expect(findOrCreateSpy).not.toHaveBeenCalled()
    })
  })
})
