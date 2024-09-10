import { Test, TestingModule } from '@nestjs/testing'
import { DataSource } from 'typeorm'

import { UsersRepository } from './users.repository'

import { userMock, usersMock } from '@common/mocks'

describe('UsersRepository', () => {
  let moduleRef: TestingModule
  let usersRepository: UsersRepository

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
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

    usersRepository = moduleRef.get(UsersRepository)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(usersRepository).toBeDefined()
  })

  test('should find all users', async () => {
    const findSpy = vi
      .spyOn(usersRepository, 'find')
      .mockResolvedValue(usersMock)

    expect(await usersRepository.findUsers()).toEqual(usersMock)
    expect(findSpy).toHaveBeenCalledWith()
  })

  test('should find user by profile id', async () => {
    const findOneSpy = vi
      .spyOn(usersRepository, 'findOne')
      .mockResolvedValue(userMock)

    const profileId = 'test'

    expect(await usersRepository.findUserByProfileId(profileId)).toEqual(
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
