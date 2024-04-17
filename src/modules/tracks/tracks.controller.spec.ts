import { Test } from '@nestjs/testing'
import { NotFoundException } from '@nestjs/common'

import { TracksController } from './tracks.controller'
import { TracksRepository } from './tracks.repository'

import { trackEntitiesMock, trackEntityMock } from '@common/mocks'

describe('TracksController', () => {
  let tracksController: TracksController
  let tracksRepository: TracksRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [TracksController],
      providers: [
        {
          provide: TracksRepository,
          useValue: {
            findTracks: vi.fn(),
            findTrackById: vi.fn(),
          },
        },
      ],
    }).compile()

    tracksController = module.get(TracksController)
    tracksRepository = module.get(TracksRepository)
  })

  test('should be defined', () => {
    expect(tracksController).toBeDefined()
  })

  describe('getTracks', () => {
    test('should get all tracks', async () => {
      const findTracksSpy = vi
        .spyOn(tracksRepository, 'findTracks')
        .mockResolvedValue(trackEntitiesMock)

      expect(await tracksController.getTracks()).toEqual(trackEntitiesMock)
      expect(findTracksSpy).toHaveBeenCalledWith()
    })
  })

  describe('getTrackById', () => {
    const id = 'id'

    test('should get track', async () => {
      const findTrackByIdSpy = vi
        .spyOn(tracksRepository, 'findTrackById')
        .mockResolvedValue(trackEntityMock)

      expect(await tracksController.getTrackById(id)).toEqual(trackEntityMock)
      expect(findTrackByIdSpy).toHaveBeenCalledWith(id)
    })

    test('should throw not found exception', async () => {
      const findTrackByIdSpy = vi
        .spyOn(tracksRepository, 'findTrackById')
        .mockResolvedValue(null)

      await expect(tracksController.getTrackById(id)).rejects.toThrowError(
        NotFoundException
      )
      expect(findTrackByIdSpy).toHaveBeenCalledWith(id)
    })
  })
})
