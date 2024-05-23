import { Test, TestingModule } from '@nestjs/testing'

import { UsersRepository } from '../users.repository'

import { UsersController } from './users.controller'

import { userMock, usersMock } from '@common/mocks'

describe('UsersController', () => {
  const displayName = 'displayName'

  let moduleRef: TestingModule
  let usersController: UsersController
  let usersRepository: UsersRepository

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
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

    usersController = moduleRef.get(UsersController)
    usersRepository = moduleRef.get(UsersRepository)
  })

  afterEach(() => {
    moduleRef.close()
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
    test('should get one user by id', () => {
      expect(usersController.getOneById(userMock)).toEqual(userMock)
    })
  })
})
