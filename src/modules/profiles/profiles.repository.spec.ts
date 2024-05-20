import { DataSource } from 'typeorm'
import { Test, TestingModule } from '@nestjs/testing'

import { ProfilesRepository } from './profiles.repository'

import { imagesMock, profileMock } from '@common/mocks'
import { ImagesRepository } from '@modules/items/images'

describe('ProfilesRepository', () => {
  let moduleRef: TestingModule
  let profilesRepository: ProfilesRepository
  let imagesRepository: ImagesRepository

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        ProfilesRepository,
        {
          provide: DataSource,
          useValue: {
            createEntityManager: vi.fn(),
          },
        },
        {
          provide: ImagesRepository,
          useValue: {
            findOrCreateImages: vi.fn(),
          },
        },
      ],
    }).compile()

    profilesRepository = moduleRef.get(ProfilesRepository)
    imagesRepository = moduleRef.get(ImagesRepository)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(profilesRepository).toBeDefined()
  })

  test('should create profile', async () => {
    const createSpy = vi
      .spyOn(profilesRepository, 'create')
      .mockReturnValue(profileMock)
    const saveSpy = vi
      .spyOn(profilesRepository, 'save')
      .mockResolvedValue(profileMock)
    const findOrCreateImagesSpy = vi
      .spyOn(imagesRepository, 'findOrCreateImages')
      .mockResolvedValue(imagesMock)

    expect(await profilesRepository.createProfile(profileMock)).toEqual(
      profileMock
    )
    expect(createSpy).toHaveBeenCalledWith(profileMock)
    expect(saveSpy).toHaveBeenCalledWith(profileMock)
    expect(findOrCreateImagesSpy).toHaveBeenCalledWith(profileMock.images)
  })
})
