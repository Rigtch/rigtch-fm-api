import { beforeEach, describe, expect, test, vi } from 'vitest'
import { Test } from '@nestjs/testing'
import { DataSource } from 'typeorm'

import { UsersRepository } from './users.repository'

import { userMock } from '@common/mocks'

describe('UsersRepository', () => {
  let usersRepository: UsersRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: DataSource,
          useValue: {
            createEntityManager: vi.fn(),
          },
        },
      ],
    }).compile()

    usersRepository = module.get(UsersRepository)
  })

  test('should be defined', () => {
    expect(usersRepository).toBeDefined()
  })

  test('should find user by display name', async () => {
    const findOneSpy = vi
      .spyOn(usersRepository, 'findOne')
      .mockResolvedValue(userMock)

    const displayName = 'test'

    expect(await usersRepository.findOneByDisplayName(displayName)).toEqual(
      userMock
    )
    expect(findOneSpy).toHaveBeenCalledWith({
      where: { profile: { displayName } },
    })
  })

  test('should find user by profile id', async () => {
    const findOneSpy = vi
      .spyOn(usersRepository, 'findOne')
      .mockResolvedValue(userMock)

    const profileId = 'test'

    expect(await usersRepository.findOneByProfileId(profileId)).toEqual(
      userMock
    )
    expect(findOneSpy).toHaveBeenCalledWith({
      where: { profile: { id: profileId } },
    })
  })

  test('should create user', async () => {
    const createSpy = vi
      .spyOn(usersRepository, 'create')
      .mockReturnValue(userMock)
    const saveSpy = vi
      .spyOn(usersRepository, 'save')
      .mockResolvedValue(userMock)

    expect(await usersRepository.createUser(userMock)).toEqual(userMock)
    expect(createSpy).toHaveBeenCalledWith(userMock)
    expect(saveSpy).toHaveBeenCalledWith(userMock)
  })
})
