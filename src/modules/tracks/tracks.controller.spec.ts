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
            findTrackByName: vi.fn(),
            findTrackById: vi.fn(),
            findTrackByExternalId: vi.fn(),
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
      const findTrackByNameSpy = vi.spyOn(tracksRepository, 'findTrackByName')
      const findTrackByExternalIdSpy = vi.spyOn(
        tracksRepository,
        'findTrackByExternalId'
      )

      expect(await tracksController.getTracks()).toEqual(trackEntitiesMock)
      expect(findTracksSpy).toHaveBeenCalledWith()
      expect(findTrackByNameSpy).not.toHaveBeenCalled()
      expect(findTrackByExternalIdSpy).not.toHaveBeenCalled()
    })

    describe('By Name', () => {
      const name = 'name'

      test('should get track', async () => {
        const findTracksSpy = vi.spyOn(tracksRepository, 'findTracks')
        const findTrackByNameSpy = vi
          .spyOn(tracksRepository, 'findTrackByName')
          .mockResolvedValue(trackEntityMock)
        const findTrackByExternalIdSpy = vi.spyOn(
          tracksRepository,
          'findTrackByExternalId'
        )

        expect(await tracksController.getTracks(name)).toEqual(trackEntityMock)
        expect(findTrackByNameSpy).toHaveBeenCalledWith(name)
        expect(findTracksSpy).not.toHaveBeenCalled()
        expect(findTrackByExternalIdSpy).not.toHaveBeenCalled()
      })

      test('should throw not found exception', async () => {
        const findTracksSpy = vi.spyOn(tracksRepository, 'findTracks')
        const findTrackByNameSpy = vi
          .spyOn(tracksRepository, 'findTrackByName')
          .mockResolvedValue(null)
        const findTrackByExternalIdSpy = vi.spyOn(
          tracksRepository,
          'findTrackByExternalId'
        )

        await expect(tracksController.getTracks(name)).rejects.toThrowError(
          NotFoundException
        )
        expect(findTrackByNameSpy).toHaveBeenCalledWith(name)
        expect(findTracksSpy).not.toHaveBeenCalled()
        expect(findTrackByExternalIdSpy).not.toHaveBeenCalled()
      })
    })

    describe('By ExternalId', () => {
      const externalId = 'externalId'

      test('should get track', async () => {
        const findTracksSpy = vi.spyOn(tracksRepository, 'findTracks')
        const findTrackByNameSpy = vi.spyOn(tracksRepository, 'findTrackByName')
        const findTrackByExternalIdSpy = vi
          .spyOn(tracksRepository, 'findTrackByExternalId')
          .mockResolvedValue(trackEntityMock)

        expect(await tracksController.getTracks(undefined, externalId)).toEqual(
          trackEntityMock
        )
        expect(findTrackByExternalIdSpy).toHaveBeenCalledWith(externalId)
        expect(findTracksSpy).not.toHaveBeenCalled()
        expect(findTrackByNameSpy).not.toHaveBeenCalled()
      })

      test('should throw not found exception', async () => {
        const findTracksSpy = vi.spyOn(tracksRepository, 'findTracks')
        const findTrackByNameSpy = vi.spyOn(tracksRepository, 'findTrackByName')
        const findTrackByExternalIdSpy = vi
          .spyOn(tracksRepository, 'findTrackByExternalId')
          .mockResolvedValue(null)

        await expect(
          tracksController.getTracks(undefined, externalId)
        ).rejects.toThrowError(NotFoundException)
        expect(findTrackByExternalIdSpy).toHaveBeenCalledWith(externalId)
        expect(findTracksSpy).not.toHaveBeenCalled()
        expect(findTrackByNameSpy).not.toHaveBeenCalled()
      })
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
