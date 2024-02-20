import { Test } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'

import { ArtistsController } from './artists.controller'
import { ArtistsRepository } from './artists.repository'

import { artistEntitiesMock, artistEntityMock } from '@common/mocks'

describe('ArtistsController', () => {
  let artistsController: ArtistsController
  let artistsRepository: ArtistsRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [ArtistsController],
      providers: [
        {
          provide: ArtistsRepository,
          useValue: {
            find: vi.fn(),
            findOne: vi.fn(),
            findOrCreateArtists: vi.fn(),
          },
        },
      ],
    }).compile()

    artistsController = module.get(ArtistsController)
    artistsRepository = module.get(ArtistsRepository)
  })

  test('should be defined', () => {
    expect(artistsController).toBeDefined()
  })

  describe('getAll', () => {
    test('should get all artists', async () => {
      const findSpy = vi
        .spyOn(artistsRepository, 'find')
        .mockResolvedValue(artistEntitiesMock)

      expect(await artistsController.getAll()).toEqual(artistEntitiesMock)
      expect(findSpy).toHaveBeenCalledWith()
    })

    test('should get artist by name', async () => {
      const name = 'name'

      const findOneSpy = vi
        .spyOn(artistsRepository, 'findOne')
        .mockResolvedValue(artistEntityMock)

      expect(await artistsController.getAll(name)).toEqual(artistEntityMock)
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { name },
      })
    })

    test('should not get artist because of not found', async () => {
      const name = 'name'

      vi.spyOn(artistsRepository, 'findOne').mockResolvedValue(null)

      await expect(artistsController.getAll(name)).rejects.toThrowError(
        NotFoundException
      )
    })
  })

  describe('getOneById', () => {
    const id = 'id'

    test('should get artist by id', async () => {
      const findOneSpy = vi
        .spyOn(artistsRepository, 'findOne')
        .mockResolvedValue(artistEntityMock)

      expect(await artistsController.getOneById(id)).toEqual(artistEntityMock)
      expect(findOneSpy).toHaveBeenCalledWith({ where: { id } })
    })

    test('should not get artist because of not found', async () => {
      vi.spyOn(artistsRepository, 'findOne').mockResolvedValue(null)

      await expect(artistsController.getOneById(id)).rejects.toThrowError(
        NotFoundException
      )
    })
  })
})
