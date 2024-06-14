import { Test, TestingModule } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'
import { PaginateQuery } from 'nestjs-paginate'
import { MockInstance } from 'vitest'
import { CacheInterceptor } from '@nestjs/cache-manager'

import { TracksController } from './tracks.controller'
import { TracksRepository } from './tracks.repository'

import {
  trackEntityMock,
  createQueryBuilderFactoryMock,
  createQueryBuilderMockImplementation,
} from '@common/mocks'

describe('TracksController', () => {
  let moduleRef: TestingModule
  let tracksController: TracksController
  let tracksRepository: TracksRepository

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [TracksController],
      providers: [
        {
          provide: TracksRepository,
          useValue: {
            findTrackById: vi.fn(),
            createQueryBuilder: createQueryBuilderFactoryMock(trackEntityMock),
          },
        },
      ],
    })
      .overrideInterceptor(CacheInterceptor)
      .useValue({
        intercept: vi.fn(),
      })
      .compile()

    tracksController = moduleRef.get(TracksController)
    tracksRepository = moduleRef.get(TracksRepository)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(tracksController).toBeDefined()
  })

  describe('getTracks', () => {
    let paginateQueryMock: PaginateQuery

    beforeEach(() => {
      paginateQueryMock = {
        path: '',
      }
    })

    test('should get paginated tracks', async () => {
      const response = await tracksController.getTracks(paginateQueryMock)

      expect(response.data).toEqual(trackEntityMock)
      expect(response.meta.itemsPerPage).toEqual(10)
      expect(response.meta.currentPage).toEqual(1)
    })

    test('should get paginated tracks with limit', async () => {
      const limit = 50

      paginateQueryMock.limit = limit

      const response = await tracksController.getTracks(paginateQueryMock)

      expect(response.data).toEqual(trackEntityMock)
      expect(response.meta.itemsPerPage).toEqual(limit)
      expect(response.meta.currentPage).toEqual(1)
    })

    test('should get paginated tracks with page', async () => {
      const page = 2

      paginateQueryMock.page = page

      const response = await tracksController.getTracks(paginateQueryMock)

      expect(response.data).toEqual(trackEntityMock)
      expect(response.meta.itemsPerPage).toEqual(10)
      expect(response.meta.currentPage).toEqual(page)
    })
  })

  describe('getTrackById', () => {
    const id = 'id'

    let createQueryBuilderSpy: MockInstance

    beforeEach(() => {
      createQueryBuilderSpy = vi.spyOn(tracksRepository, 'createQueryBuilder')
    })

    test('should get track', async () => {
      createQueryBuilderSpy.mockReturnValue(
        createQueryBuilderMockImplementation(trackEntityMock)
      )

      expect(await tracksController.getTrackById(id)).toEqual(trackEntityMock)
      expect(createQueryBuilderSpy).toHaveBeenCalledWith('track')
    })

    test('should throw not found exception', async () => {
      createQueryBuilderSpy.mockReturnValue(
        createQueryBuilderMockImplementation(null)
      )

      await expect(tracksController.getTrackById(id)).rejects.toThrowError(
        NotFoundException
      )
      expect(createQueryBuilderSpy).toHaveBeenCalledWith('track')
    })
  })
})
