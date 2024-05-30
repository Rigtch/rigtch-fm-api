import { Test, TestingModule } from '@nestjs/testing'
import { MockInstance } from 'vitest'

import { AuthService } from './auth.service'

import {
  accessToken,
  refreshToken,
  profileMock,
  userMock,
  accessTokenMock,
} from '@common/mocks'
import { UsersRepository } from '@modules/users'
import { ProfilesRepository } from '@modules/profiles'
import { SpotifyService } from '@modules/spotify'

describe('AuthService', () => {
  let moduleRef: TestingModule
  let authService: AuthService
  let usersRepository: UsersRepository
  let profilesRepository: ProfilesRepository
  let spotifyService: SpotifyService

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersRepository,
          useValue: {
            findUserByProfileId: vi.fn(),
            createUser: vi.fn(),
          },
        },
        {
          provide: ProfilesRepository,
          useValue: {
            createProfile: vi.fn(),
          },
        },
        {
          provide: SpotifyService,
          useValue: {
            users: {
              profile: vi.fn(),
            },
          },
        },
      ],
    }).compile()

    authService = moduleRef.get(AuthService)
    usersRepository = moduleRef.get(UsersRepository)
    profilesRepository = moduleRef.get(ProfilesRepository)
    spotifyService = moduleRef.get(SpotifyService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(authService).toBeDefined()
  })

  describe('saveUser', () => {
    let profileSpy: MockInstance
    let findOneByProfileIdSpy: MockInstance
    let createProfileSpy: MockInstance
    let createUserSpy: MockInstance

    beforeEach(() => {
      profileSpy = vi.spyOn(spotifyService.users, 'profile')
      findOneByProfileIdSpy = vi.spyOn(usersRepository, 'findUserByProfileId')
      createProfileSpy = vi.spyOn(profilesRepository, 'createProfile')
      createUserSpy = vi.spyOn(usersRepository, 'createUser')
    })

    test('should create new user', async () => {
      profileSpy.mockResolvedValue(profileMock)
      createProfileSpy.mockResolvedValue(profileMock)
      createUserSpy.mockResolvedValue(userMock)

      expect(await authService.saveUser(accessTokenMock)).toEqual({
        accessToken,
        refreshToken,
        id: userMock.id,
      })
      expect(profileSpy).toHaveBeenCalledWith(accessTokenMock)
      expect(findOneByProfileIdSpy).toHaveBeenCalledWith(profileMock.id)
      expect(createProfileSpy).toHaveBeenCalledWith(profileMock)
      expect(createUserSpy).toHaveBeenCalledWith({
        profile: profileMock,
        refreshToken,
      })
    })

    test('should return existing user', async () => {
      profileSpy.mockResolvedValue(profileMock)
      findOneByProfileIdSpy.mockResolvedValue(userMock)

      expect(await authService.saveUser(accessTokenMock)).toEqual({
        accessToken,
        refreshToken,
        id: userMock.id,
      })
      expect(profileSpy).toHaveBeenCalledWith(accessTokenMock)
      expect(findOneByProfileIdSpy).toHaveBeenCalledWith(profileMock.id)
      expect(createProfileSpy).not.toHaveBeenCalled()
      expect(createUserSpy).not.toHaveBeenCalled()
    })
  })
})
