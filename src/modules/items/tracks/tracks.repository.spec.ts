import { DataSource, In } from 'typeorm'
import { Test, TestingModule } from '@nestjs/testing'

import { TracksRepository, tracksRelations } from './tracks.repository'

import {
  albumEntityMock,
  artistEntitiesMock,
  sdkTrackMock,
  trackEntitiesMock,
  trackEntityMock,
} from '@common/mocks'

describe('TracksRepository', () => {
  let moduleRef: TestingModule
  let tracksRepository: TracksRepository

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        TracksRepository,
        {
          provide: DataSource,
          useValue: {
            createEntityManager: vi.fn(),
          },
        },
      ],
    }).compile()

    tracksRepository = moduleRef.get(TracksRepository)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(tracksRepository).toBeDefined()
  })

  test('should find tracks', async () => {
    const findSpy = vi
      .spyOn(tracksRepository, 'find')
      .mockResolvedValue(trackEntitiesMock)

    expect(await tracksRepository.findTracks()).toEqual(trackEntitiesMock)
    expect(findSpy).toHaveBeenCalledWith({
      relations: tracksRelations,
    })
  })

  test('should find track by external id', async () => {
    const externalId = 'externalId'

    const findOneSpy = vi
      .spyOn(tracksRepository, 'findOne')
      .mockResolvedValue(trackEntityMock)

    expect(await tracksRepository.findTrackByExternalId(externalId)).toEqual(
      trackEntityMock
    )
    expect(findOneSpy).toHaveBeenCalledWith({
      where: { externalId },
      relations: tracksRelations,
    })
  })

  test('should find track by id', async () => {
    const id = 'id'

    const findOneSpy = vi
      .spyOn(tracksRepository, 'findOne')
      .mockResolvedValue(trackEntityMock)

    expect(await tracksRepository.findTrackById(id)).toEqual(trackEntityMock)
    expect(findOneSpy).toHaveBeenCalledWith({
      where: { id },
      relations: tracksRelations,
    })
  })

  test('should find track by name', async () => {
    const name = 'name'

    const findOneSpy = vi
      .spyOn(tracksRepository, 'findOne')
      .mockResolvedValue(trackEntityMock)

    expect(await tracksRepository.findTrackByName(name)).toEqual(
      trackEntityMock
    )
    expect(findOneSpy).toHaveBeenCalledWith({
      where: { name },
      relations: tracksRelations,
    })
  })

  test('should find tracks by external ids', async () => {
    const externalIds = ['id1', 'id2']

    const findSpy = vi
      .spyOn(tracksRepository, 'find')
      .mockResolvedValue(trackEntitiesMock)

    expect(await tracksRepository.findTracksByExternalIds(externalIds)).toEqual(
      trackEntitiesMock
    )
    expect(findSpy).toHaveBeenCalledWith({
      where: { externalId: In(externalIds) },
      relations: tracksRelations,
    })
  })

  test('should create track', async () => {
    const createSpy = vi
      .spyOn(tracksRepository, 'create')
      .mockReturnValue(trackEntityMock)
    const saveSpy = vi
      .spyOn(tracksRepository, 'save')
      .mockResolvedValue(trackEntityMock)

    expect(
      await tracksRepository.createTrack({
        ...sdkTrackMock,
        externalId: sdkTrackMock.id,
        duration: sdkTrackMock.duration_ms,
        trackNumber: sdkTrackMock.track_number,
        discNumber: sdkTrackMock.disc_number,
        album: albumEntityMock,
        artists: artistEntitiesMock,
      })
    ).toEqual(trackEntityMock)
    expect(createSpy).toHaveBeenCalled()
    expect(saveSpy).toHaveBeenCalledWith(trackEntityMock)
  })
})
