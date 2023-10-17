import { beforeEach, describe, expect, test, vi } from 'vitest'
import { DataSource } from 'typeorm'
import { Test, TestingModule } from '@nestjs/testing'

import { ProfilesRepository } from './profiles.repository'

import { profileMock, profilesMock } from '@common/mocks'

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

  test('should find all profiles', async () => {
    vi.spyOn(profilesRepository, 'find').mockResolvedValue(profilesMock)

    const profiles = await profilesRepository.findProfiles()

    expect(profiles).toEqual(profilesMock)
    expect(profilesRepository.find).toHaveBeenCalled()
  })

  test('should find profile by id', async () => {
    vi.spyOn(profilesRepository, 'findOne').mockResolvedValue(profileMock)

    const id = '1'
    const profile = await profilesRepository.findProfileById(id)

    expect(profile).toEqual(profileMock)
    expect(profilesRepository.findOne).toHaveBeenCalledWith({
      where: { id },
      relations: ['images'],
    })
  })

  test('should create profile', async () => {
    vi.spyOn(profilesRepository, 'create').mockReturnValue(profileMock)
    vi.spyOn(profilesRepository, 'save').mockResolvedValue(profileMock)

    const profile = await profilesRepository.createProfile(profileMock)

    expect(profile).toEqual(profileMock)
    expect(profilesRepository.create).toHaveBeenCalledWith(profileMock)
    expect(profilesRepository.save).toHaveBeenCalledWith(profileMock)
  })

  test('should update profile', async () => {
    vi.spyOn(profilesRepository, 'findProfileById').mockResolvedValue(
      profileMock
    )
    vi.spyOn(profilesRepository, 'save').mockResolvedValue(profileMock)

    const id = '1'
    const profile = await profilesRepository.updateProfile(id, profileMock)

    expect(profile).toEqual(profileMock)
    expect(profilesRepository.findProfileById).toHaveBeenCalledWith(id)
    expect(profilesRepository.save).toHaveBeenCalledWith(profileMock)
  })

  test('should remove profile', async () => {
    vi.spyOn(profilesRepository, 'findProfileById').mockResolvedValue(
      profileMock
    )
    vi.spyOn(profilesRepository, 'remove').mockResolvedValue(profileMock)

    const id = '1'
    const profile = await profilesRepository.removeProfile(id)

    expect(profile).toEqual(profileMock)
    expect(profilesRepository.findProfileById).toHaveBeenCalledWith(id)
    expect(profilesRepository.remove).toHaveBeenCalledWith(profileMock)
  })
})
