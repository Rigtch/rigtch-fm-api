import { Test, TestingModule } from '@nestjs/testing'

import { UsersRepository } from '../users.repository'

import { UsersController } from './users.controller'

import { userMock, usersMock } from '@common/mocks'

describe('UsersController', () => {
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
  })

  describe('getOneById', () => {
    test('should get one user by id', () => {
      expect(usersController.getOneById(userMock)).toEqual(userMock)
    })
  })
})
