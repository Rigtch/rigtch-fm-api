import { beforeEach, describe, expect, test, vi } from 'vitest'
import { Test, TestingModule } from '@nestjs/testing'
import { mock } from 'vitest-mock-extended'

import { ProfilesService } from './profiles.service'
import { ProfilesRepository } from './profiles.repository'
import { CreateProfile } from './dtos'
import { Profile } from './profile.entity'

import { Image, ImagesRepository } from '@modules/images'

describe('ProfilesService', () => {
  let profileService: ProfilesService
  let profileRepository: ProfilesRepository
  let imagesRepository: ImagesRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesService,
        {
          provide: ProfilesRepository,
          useValue: {
            createProfile: vi.fn(),
          },
        },
        {
          provide: ImagesRepository,
          useValue: {
            createImage: vi.fn(),
          },
        },
      ],
    }).compile()

    profileService = module.get<ProfilesService>(ProfilesService)
    profileRepository = module.get<ProfilesRepository>(ProfilesRepository)
    imagesRepository = module.get<ImagesRepository>(ImagesRepository)
  })

  test('should be defined', () => {
    expect(profileService).toBeDefined()
  })

  test('should create profile', async () => {
    const imageMock = mock<Image>()
    const createProfileMock = mock<CreateProfile>({
      images: [imageMock],
    })
    const profileMock = mock<Profile>()

    const createProfileSpy = vi
      .spyOn(profileRepository, 'createProfile')
      .mockResolvedValue(profileMock)
    const createImageSpy = vi
      .spyOn(imagesRepository, 'createImage')
      .mockResolvedValue(imageMock)

    expect(await profileService.create(createProfileMock)).toEqual(profileMock)

    expect(createProfileSpy).toHaveBeenCalled()
    expect(createImageSpy).toHaveBeenCalled()
  })
})
