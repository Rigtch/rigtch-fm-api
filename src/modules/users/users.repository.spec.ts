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
    vi.spyOn(usersRepository, 'findOne').mockResolvedValue(userMock)

    const displayName = 'test'
    const user = await usersRepository.findOneByDisplayName(displayName)

    expect(user).toEqual(userMock)
    expect(usersRepository.findOne).toHaveBeenCalledWith({
      where: { profile: { displayName } },
      relations: ['profile'],
    })
  })

  test('should create user', async () => {
    vi.spyOn(usersRepository, 'create').mockReturnValue(userMock)
    vi.spyOn(usersRepository, 'save').mockResolvedValue(userMock)

    const user = await usersRepository.createUser(userMock)

    expect(user).toEqual(userMock)
    expect(usersRepository.create).toHaveBeenCalledWith(userMock)
    expect(usersRepository.save).toHaveBeenCalledWith(userMock)
  })
})
