import { beforeEach, describe, expect, test, vi } from 'vitest'
import { DataSource } from 'typeorm'
import { Test, TestingModule } from '@nestjs/testing'

import { ProfilesRepository } from './profiles.repository'

import { profileMock } from '@common/mocks'

describe('ProfilesRepository', () => {
  let profilesRepository: ProfilesRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfilesRepository,
        {
          provide: DataSource,
          useValue: {
            createEntityManager: vi.fn(),
          },
        },
      ],
    }).compile()

    profilesRepository = module.get<ProfilesRepository>(ProfilesRepository)
  })

  test('should be defined', () => {
    expect(profilesRepository).toBeDefined()
  })

  test('should create profile', async () => {
    vi.spyOn(profilesRepository, 'create').mockReturnValue(profileMock)
    vi.spyOn(profilesRepository, 'save').mockResolvedValue(profileMock)

    const profile = await profilesRepository.createProfile(profileMock)

    expect(profile).toEqual(profileMock)
    expect(profilesRepository.create).toHaveBeenCalledWith(profileMock)
    expect(profilesRepository.save).toHaveBeenCalledWith(profileMock)
  })
})
