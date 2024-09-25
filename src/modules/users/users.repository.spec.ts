import { Test, TestingModule } from '@nestjs/testing'
import { DataSource } from 'typeorm'
import { MockInstance } from 'vitest'

import { User } from './user.entity'
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

  describe('follow', () => {
    const userId = 'userId'
    const followerId = 'followerId'
    const relations = {
      followers: true,
      following: true,
    }

    let findOneSpy: MockInstance
    let saveSpy: MockInstance

    let followedMock: User
    let followerMock: User

    beforeEach(() => {
      findOneSpy = vi.spyOn(usersRepository, 'findOne')
      saveSpy = vi.spyOn(usersRepository, 'save')

      followedMock = {
        ...userMock,
        id: userId,
      }
      followerMock = {
        ...userMock,
        id: followerId,
      }
    })

    test('should follow user', async () => {
      findOneSpy.mockResolvedValue(followedMock)
      findOneSpy.mockResolvedValue(followerMock)
      saveSpy.mockResolvedValue(followedMock)

      expect(await usersRepository.follow(userId, followerId)).toBeTruthy()

      expect(findOneSpy).toHaveBeenCalledWith({
        where: { id: userId },
        relations,
      })
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { id: followerId },
        relations,
      })
      expect(saveSpy).toHaveBeenCalledTimes(2)
    })

    test('should not follow user if user does not exist', async () => {
      findOneSpy.mockResolvedValueOnce(null)
      findOneSpy.mockResolvedValue(followerMock)
      saveSpy.mockResolvedValue(followedMock)

      expect(await usersRepository.follow(userId, followerId)).toBeFalsy()

      expect(findOneSpy).toHaveBeenCalledWith({
        where: { id: userId },
        relations,
      })
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { id: followerId },
        relations,
      })
      expect(saveSpy).not.toHaveBeenCalled()
    })

    test('should not follow user if follower does not exist', async () => {
      findOneSpy.mockResolvedValue(followedMock)
      findOneSpy.mockResolvedValueOnce(null)
      saveSpy.mockResolvedValue(followedMock)

      expect(await usersRepository.follow(userId, followerId)).toBeFalsy()

      expect(findOneSpy).toHaveBeenCalledWith({
        where: { id: userId },
        relations,
      })
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { id: followerId },
        relations,
      })
      expect(saveSpy).not.toHaveBeenCalled()
    })

    test('should not follow user if user is already following', async () => {
      followedMock.followers.push(followerMock)
      followedMock.followersCount++
      findOneSpy.mockResolvedValue(followedMock)
      findOneSpy.mockResolvedValue(followerMock)
      saveSpy.mockResolvedValue(followedMock)

      expect(await usersRepository.follow(userId, followerId)).toBeFalsy()

      expect(findOneSpy).toHaveBeenCalledWith({
        where: { id: userId },
        relations,
      })
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { id: followerId },
        relations,
      })
      expect(saveSpy).not.toHaveBeenCalled()
    })
  })
})
