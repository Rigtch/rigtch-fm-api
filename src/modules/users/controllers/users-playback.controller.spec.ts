import { Test, TestingModule } from '@nestjs/testing'
import { UnauthorizedException } from '@nestjs/common'
import { mock } from 'vitest-mock-extended'

import { UsersRepository } from '../users.repository'

import { UsersPlaybackController } from './users-playback.controller'

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
  const fakeProfileMock = mock<Profile>({
    id: '2',
  })

  let moduleRef: TestingModule
  let usersPlaybackController: UsersPlaybackController
  let spotifyAuthService: SpotifyAuthService
  let spotifyPlayerService: SpotifyPlayerService

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [UsersPlaybackController],
      providers: [
        {
          provide: SpotifyAuthService,
          useValue: {
            token: vi.fn(),
            getMeProfile: vi.fn(),
          },
        },
        {
          provide: UsersRepository,
          useValue: {
            findOneBy: vi.fn(),
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

    usersPlaybackController = moduleRef.get(UsersPlaybackController)
    spotifyAuthService = moduleRef.get(SpotifyAuthService)
    spotifyPlayerService = moduleRef.get(SpotifyPlayerService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  describe('getPlaybackState', () => {
    test('should get user playback state', async () => {
      const tokenSpy = vi
        .spyOn(spotifyAuthService, 'token')
        .mockResolvedValue(accessTokenMock)
      const currentPlaybackStateSpy = vi
        .spyOn(spotifyPlayerService, 'getPlaybackState')
        .mockResolvedValue(playbackStateMock)

      expect(await usersPlaybackController.getPlaybackState(userMock)).toEqual(
        playbackStateMock
      )

      expect(currentPlaybackStateSpy).toHaveBeenCalledWith(accessTokenMock)
      expect(tokenSpy).toHaveBeenCalledWith({
        refreshToken: userMock.refreshToken,
      })
    })
  })

  describe('pausePlayback', () => {
    test('should pause user playback', async () => {
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
        await usersPlaybackController.pausePlayback(userMock, accessToken)
      ).toEqual({ success: true })

      expect(pausePlaybackSpy).toHaveBeenCalledWith(accessTokenMock)
      expect(tokenSpy).toHaveBeenCalledWith({
        refreshToken: userMock.refreshToken,
      })
      expect(getMeProfileSpy).toHaveBeenCalledWith(accessToken)
    })

    test('should throw an error if user is not authorized', async () => {
      const tokenSpy = vi
        .spyOn(spotifyAuthService, 'token')
        .mockResolvedValue(accessTokenMock)
      const getMeProfileSpy = vi
        .spyOn(spotifyAuthService, 'getMeProfile')
        .mockResolvedValue(fakeProfileMock)

      await expect(
        usersPlaybackController.pausePlayback(userMock, accessToken)
      ).rejects.toThrowError(UnauthorizedException)

      expect(tokenSpy).not.toHaveBeenCalled()
      expect(getMeProfileSpy).toHaveBeenCalledWith(accessToken)
    })
  })

  describe('resumePlayback', () => {
    test('should resume user playback', async () => {
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
        await usersPlaybackController.resumePlayback(userMock, accessToken)
      ).toEqual({ success: true })

      expect(resumePlaybackSpy).toHaveBeenCalledWith(accessTokenMock)
      expect(tokenSpy).toHaveBeenCalledWith({
        refreshToken: userMock.refreshToken,
      })
      expect(getMeProfileSpy).toHaveBeenCalledWith(accessToken)
    })

    test('should throw an error if user is not authorized', async () => {
      const tokenSpy = vi
        .spyOn(spotifyAuthService, 'token')
        .mockResolvedValue(accessTokenMock)
      const getMeProfileSpy = vi
        .spyOn(spotifyAuthService, 'getMeProfile')
        .mockResolvedValue(fakeProfileMock)

      await expect(
        usersPlaybackController.resumePlayback(userMock, accessToken)
      ).rejects.toThrowError(UnauthorizedException)

      expect(tokenSpy).not.toHaveBeenCalled()
      expect(getMeProfileSpy).toHaveBeenCalledWith(accessToken)
    })
  })
})
