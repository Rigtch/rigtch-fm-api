import { Test } from '@nestjs/testing'
import { NotFoundException, UnauthorizedException } from '@nestjs/common'
import { mock } from 'vitest-mock-extended'

import { UsersPlaybackController } from './users-playback.controller'
import { UsersRepository } from './users.repository'

import { SpotifyAuthService } from '@modules/spotify/auth'
import { SpotifyPlayerService } from '@modules/spotify/player'
import {
  accessToken,
  accessTokenMock,
  playbackStateMock,
  userMock,
} from '@common/mocks'
import { Profile } from '@common/types/spotify'

describe('UsersPlaybackController', () => {
  const id = '1'
  const fakeProfileMock = mock<Profile>({
    id: '2',
  })

  let usersPlaybackController: UsersPlaybackController
  let usersRepository: UsersRepository
  let spotifyAuthService: SpotifyAuthService
  let spotifyPlayerService: SpotifyPlayerService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersPlaybackController],
      providers: [
        {
          provide: UsersRepository,
          useValue: {
            findOneBy: vi.fn(),
          },
        },
        {
          provide: SpotifyAuthService,
          useValue: {
            token: vi.fn(),
            getMeProfile: vi.fn(),
          },
        },
        {
          provide: SpotifyPlayerService,
          useValue: {
            getPlaybackState: vi.fn(),
            pausePlayback: vi.fn(),
            resumePlayback: vi.fn(),
          },
        },
      ],
    }).compile()

    usersPlaybackController = module.get(UsersPlaybackController)
    usersRepository = module.get(UsersRepository)
    spotifyAuthService = module.get(SpotifyAuthService)
    spotifyPlayerService = module.get(SpotifyPlayerService)
  })

  describe('getPlaybackState', () => {
    test('should get user playback state', async () => {
      const findOneBySpy = vi
        .spyOn(usersRepository, 'findOneBy')
        .mockResolvedValue(userMock)
      const tokenSpy = vi
        .spyOn(spotifyAuthService, 'token')
        .mockResolvedValue(accessTokenMock)
      const currentPlaybackStateSpy = vi
        .spyOn(spotifyPlayerService, 'getPlaybackState')
        .mockResolvedValue(playbackStateMock)

      expect(await usersPlaybackController.getPlaybackState(id)).toEqual(
        playbackStateMock
      )
      expect(currentPlaybackStateSpy).toHaveBeenCalledWith(accessTokenMock)
      expect(findOneBySpy).toHaveBeenCalledWith({ id })
      expect(tokenSpy).toHaveBeenCalledWith({
        refreshToken: userMock.refreshToken,
      })
    })

    test('should throw an error if no user is found', async () => {
      const findOneBySpy = vi.spyOn(usersRepository, 'findOneBy')

      await expect(
        usersPlaybackController.getPlaybackState(id)
      ).rejects.toThrowError(NotFoundException)

      expect(findOneBySpy).toHaveBeenCalledWith({ id })
    })
  })

  describe('pausePlayback', () => {
    test('should pause user playback', async () => {
      const findOneBySpy = vi
        .spyOn(usersRepository, 'findOneBy')
        .mockResolvedValue(userMock)
      const tokenSpy = vi
        .spyOn(spotifyAuthService, 'token')
        .mockResolvedValue(accessTokenMock)
      const getMeProfileSpy = vi
        .spyOn(spotifyAuthService, 'getMeProfile')
        .mockResolvedValue(userMock.profile)
      const pausePlaybackSpy = vi
        .spyOn(spotifyPlayerService, 'pausePlayback')
        .mockResolvedValue(true)

      expect(
        await usersPlaybackController.pausePlayback(id, accessToken)
      ).toEqual({ success: true })
      expect(pausePlaybackSpy).toHaveBeenCalledWith(accessTokenMock)
      expect(findOneBySpy).toHaveBeenCalledWith({ id })
      expect(tokenSpy).toHaveBeenCalledWith({
        refreshToken: userMock.refreshToken,
      })
      expect(getMeProfileSpy).toHaveBeenCalledWith(accessToken)
    })

    test('should throw an error if no user is found', async () => {
      const findOneBySpy = vi.spyOn(usersRepository, 'findOneBy')

      await expect(
        usersPlaybackController.pausePlayback(id, accessToken)
      ).rejects.toThrowError(NotFoundException)

      expect(findOneBySpy).toHaveBeenCalledWith({ id })
    })

    test('should throw an error if user is not authorized', async () => {
      const findOneBySpy = vi
        .spyOn(usersRepository, 'findOneBy')
        .mockResolvedValue(userMock)
      const tokenSpy = vi
        .spyOn(spotifyAuthService, 'token')
        .mockResolvedValue(accessTokenMock)
      const getMeProfileSpy = vi
        .spyOn(spotifyAuthService, 'getMeProfile')
        .mockResolvedValue(fakeProfileMock)

      await expect(
        usersPlaybackController.pausePlayback(id, accessToken)
      ).rejects.toThrowError(UnauthorizedException)

      expect(findOneBySpy).toHaveBeenCalledWith({ id })
      expect(tokenSpy).not.toHaveBeenCalled()
      expect(getMeProfileSpy).toHaveBeenCalledWith(accessToken)
    })
  })

  describe('resumePlayback', () => {
    test('should resume user playback', async () => {
      const findOneBySpy = vi
        .spyOn(usersRepository, 'findOneBy')
        .mockResolvedValue(userMock)
      const tokenSpy = vi
        .spyOn(spotifyAuthService, 'token')
        .mockResolvedValue(accessTokenMock)
      const getMeProfileSpy = vi
        .spyOn(spotifyAuthService, 'getMeProfile')
        .mockResolvedValue(userMock.profile)
      const resumePlaybackSpy = vi
        .spyOn(spotifyPlayerService, 'resumePlayback')
        .mockResolvedValue(true)

      expect(
        await usersPlaybackController.resumePlayback(id, accessToken)
      ).toEqual({ success: true })
      expect(resumePlaybackSpy).toHaveBeenCalledWith(accessTokenMock)
      expect(findOneBySpy).toHaveBeenCalledWith({ id })
      expect(tokenSpy).toHaveBeenCalledWith({
        refreshToken: userMock.refreshToken,
      })
      expect(getMeProfileSpy).toHaveBeenCalledWith(accessToken)
    })

    test('should throw an error if no user is found', async () => {
      const findOneBySpy = vi.spyOn(usersRepository, 'findOneBy')

      await expect(
        usersPlaybackController.resumePlayback(id, accessToken)
      ).rejects.toThrowError(NotFoundException)

      expect(findOneBySpy).toHaveBeenCalledWith({ id })
    })

    test('should throw an error if user is not authorized', async () => {
      const findOneBySpy = vi
        .spyOn(usersRepository, 'findOneBy')
        .mockResolvedValue(userMock)
      const tokenSpy = vi
        .spyOn(spotifyAuthService, 'token')
        .mockResolvedValue(accessTokenMock)
      const getMeProfileSpy = vi
        .spyOn(spotifyAuthService, 'getMeProfile')
        .mockResolvedValue(fakeProfileMock)

      await expect(
        usersPlaybackController.resumePlayback(id, accessToken)
      ).rejects.toThrowError(UnauthorizedException)

      expect(findOneBySpy).toHaveBeenCalledWith({ id })
      expect(tokenSpy).not.toHaveBeenCalled()
      expect(getMeProfileSpy).toHaveBeenCalledWith(accessToken)
    })
  })
})
