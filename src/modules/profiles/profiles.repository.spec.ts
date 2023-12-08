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
    const createSpy = vi
      .spyOn(profilesRepository, 'create')
      .mockReturnValue(profileMock)
    const saveSpy = vi
      .spyOn(profilesRepository, 'save')
      .mockResolvedValue(profileMock)

    expect(await profilesRepository.createProfile(profileMock)).toEqual(
      profileMock
    )
    expect(createSpy).toHaveBeenCalledWith(profileMock)
    expect(saveSpy).toHaveBeenCalledWith(profileMock)
  })
})
