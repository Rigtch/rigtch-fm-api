import { Test } from '@nestjs/testing'

import { UsersRepository } from '../users.repository'

import { UsersController } from './users.controller'

import { userMock, usersMock } from '@common/mocks'

describe('UsersController', () => {
  const id = '1'
  const displayName = 'displayName'

  let usersController: UsersController
  let usersRepository: UsersRepository

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersController,
        {
          provide: UsersRepository,
          useValue: {
            findUsers: vi.fn(),
            findUserById: vi.fn(),
            findUserByDisplayName: vi.fn(),
          },
        },
      ],
    }).compile()

    usersController = module.get(UsersController)
    usersRepository = module.get(UsersRepository)
  })

  test('should be defined', () => {
    expect(usersController).toBeDefined()
  })

  describe('getAll', () => {
    test('should get all users', async () => {
      const findSpy = vi
        .spyOn(usersRepository, 'findUsers')
        .mockResolvedValue(usersMock)

      expect(await usersController.getAll()).toEqual(usersMock)

      expect(findSpy).toHaveBeenCalled()
    })

    test('should get one user by username', async () => {
      const findOneByDisplayNameSpy = vi
        .spyOn(usersRepository, 'findUserByDisplayName')
        .mockResolvedValue(userMock)

      expect(await usersController.getAll(displayName)).toEqual(userMock)

      expect(findOneByDisplayNameSpy).toHaveBeenCalledWith(displayName)
    })

    test('should throw an error if no user is found', async () => {
      const findOneByDisplayNameSpy = vi.spyOn(
        usersRepository,
        'findUserByDisplayName'
      )

      await expect(usersController.getAll(displayName)).rejects.toThrowError()
      expect(findOneByDisplayNameSpy).toHaveBeenCalledWith(displayName)
    })
  })

  describe('getOneById', () => {
    test('should get one user by id', async () => {
      const findOneBySpy = vi
        .spyOn(usersRepository, 'findUserById')
        .mockResolvedValue(userMock)

      expect(await usersController.getOneById(id)).toEqual(userMock)

      expect(findOneBySpy).toHaveBeenCalledWith(id)
    })

    test('should throw an error if no user is found', async () => {
      const findOneBySpy = vi.spyOn(usersRepository, 'findUserById')

      await expect(usersController.getOneById(id)).rejects.toThrowError()

      expect(findOneBySpy).toHaveBeenCalledWith(id)
    })
  })
})
