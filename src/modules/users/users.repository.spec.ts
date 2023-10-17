import { beforeEach, describe, expect, test, vi } from 'vitest'
import { Test, TestingModule } from '@nestjs/testing'
import { DataSource } from 'typeorm'

import { UsersRepository } from './users.repository'

import { userMock, usersMock } from '@common/mocks'

describe('UsersRepository', () => {
  let usersRepository: UsersRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    usersRepository = module.get<UsersRepository>(UsersRepository)
  })

  test('should be defined', () => {
    expect(usersRepository).toBeDefined()
  })

  test('should find all users', async () => {
    vi.spyOn(usersRepository, 'find').mockResolvedValue(usersMock)

    const users = await usersRepository.findUsers()

    expect(users).toEqual(usersMock)
    expect(usersRepository.find).toHaveBeenCalled()
  })

  test('should find user by id', async () => {
    vi.spyOn(usersRepository, 'findOne').mockResolvedValue(userMock)

    const id = '1'
    const user = await usersRepository.findUser(id)

    expect(user).toEqual(userMock)
    expect(usersRepository.findOne).toHaveBeenCalledWith({
      where: { id },
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

  test('should update user', async () => {
    vi.spyOn(usersRepository, 'findUser').mockResolvedValue(userMock)
    vi.spyOn(usersRepository, 'save').mockResolvedValue(userMock)

    const id = '1'
    const user = await usersRepository.updateUser(id, userMock)

    expect(user).toEqual(userMock)
    expect(usersRepository.findUser).toHaveBeenCalledWith(id)
    expect(usersRepository.save).toHaveBeenCalledWith(userMock)
  })

  test('should remove user', async () => {
    vi.spyOn(usersRepository, 'findUser').mockResolvedValue(userMock)
    vi.spyOn(usersRepository, 'remove').mockResolvedValue(userMock)

    const id = '1'
    const user = await usersRepository.removeUser(id)

    expect(user).toEqual(userMock)
    expect(usersRepository.findUser).toHaveBeenCalledWith(id)
    expect(usersRepository.remove).toHaveBeenCalledWith(userMock)
  })
})