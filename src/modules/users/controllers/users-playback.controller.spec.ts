import { Test, TestingModule } from '@nestjs/testing'
import { UnauthorizedException } from '@nestjs/common'
import { mock } from 'vitest-mock-extended'
import { MockInstance } from 'vitest'

import { UsersRepository } from '../users.repository'

import { UsersPlaybackController } from './users-playback.controller'

import {
  accessToken,
  accessTokenMock,
  playbackStateMock,
  userMock,
} from '@common/mocks'
import { Profile } from '@common/types/spotify'
import { SpotifyService } from '@modules/spotify'

describe('UsersPlaybackController', () => {
  const fakeProfileMock = mock<Profile>({
    id: '2',
  })

  let moduleRef: TestingModule
  let usersPlaybackController: UsersPlaybackController
  let spotifyService: SpotifyService

  let tokenSpy: MockInstance
  let getMeProfileSpy: MockInstance

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      controllers: [UsersPlaybackController],
      providers: [
        {
          provide: UsersRepository,
          useValue: {
            findOneBy: vi.fn(),
          },
        },
        {
          provide: SpotifyService,
          useValue: {
            player: {
              getPlaybackState: vi.fn(),
              pausePlayback: vi.fn(),
              resumePlayback: vi.fn(),
            },
            auth: {
              token: vi.fn(),
              getMeProfile: vi.fn(),
            },
          },
        },
      ],
    }).compile()

    usersPlaybackController = moduleRef.get(UsersPlaybackController)
    spotifyService = moduleRef.get(SpotifyService)

    tokenSpy = vi
      .spyOn(spotifyService.auth, 'token')
      .mockResolvedValue(accessTokenMock)
    getMeProfileSpy = vi.spyOn(spotifyService.auth, 'getMeProfile')
  })

  afterEach(() => {
    moduleRef.close()
  })

  describe('getPlaybackState', () => {
    test('should get user playback state', async () => {
      const currentPlaybackStateSpy = vi
        .spyOn(spotifyService.player, 'getPlaybackState')
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
      getMeProfileSpy.mockResolvedValue(userMock.profile)
      const pausePlaybackSpy = vi
        .spyOn(spotifyService.player, 'pausePlayback')
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
      getMeProfileSpy.mockResolvedValue(fakeProfileMock)

      await expect(
        usersPlaybackController.pausePlayback(userMock, accessToken)
      ).rejects.toThrowError(UnauthorizedException)

      expect(tokenSpy).not.toHaveBeenCalled()
      expect(getMeProfileSpy).toHaveBeenCalledWith(accessToken)
    })
  })

  describe('resumePlayback', () => {
    test('should resume user playback', async () => {
      getMeProfileSpy.mockResolvedValue(userMock.profile)
      const resumePlaybackSpy = vi
        .spyOn(spotifyService.player, 'resumePlayback')
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
      getMeProfileSpy.mockResolvedValue(fakeProfileMock)

      await expect(
        usersPlaybackController.resumePlayback(userMock, accessToken)
      ).rejects.toThrowError(UnauthorizedException)

      expect(tokenSpy).not.toHaveBeenCalled()
      expect(getMeProfileSpy).toHaveBeenCalledWith(accessToken)
    })
  })
})
