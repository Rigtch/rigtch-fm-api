import { Test, TestingModule } from '@nestjs/testing'

import { UsersRepository } from '../users.repository'

import { UsersPlaybackController } from './users-playback.controller'

import { accessTokenMock, playbackStateMock } from '@common/mocks'
import { SpotifyService } from '@modules/spotify'

describe('UsersPlaybackController', () => {
  let moduleRef: TestingModule
  let usersPlaybackController: UsersPlaybackController
  let spotifyService: SpotifyService

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
          },
        },
      ],
    }).compile()

    usersPlaybackController = moduleRef.get(UsersPlaybackController)
    spotifyService = moduleRef.get(SpotifyService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  describe('getPlaybackState', () => {
    test('should get user playback state', async () => {
      const currentPlaybackStateSpy = vi
        .spyOn(spotifyService.player, 'getPlaybackState')
        .mockResolvedValue(playbackStateMock)

      expect(
        await usersPlaybackController.getPlaybackState(accessTokenMock)
      ).toEqual(playbackStateMock)

      expect(currentPlaybackStateSpy).toHaveBeenCalledWith(accessTokenMock)
    })
  })

  describe('pausePlayback', () => {
    test('should pause user playback', async () => {
      const pausePlaybackSpy = vi
        .spyOn(spotifyService.player, 'pausePlayback')
        .mockResolvedValue(true)

      expect(
        await usersPlaybackController.pausePlayback(accessTokenMock)
      ).toEqual({ success: true })

      expect(pausePlaybackSpy).toHaveBeenCalledWith(accessTokenMock)
    })
  })

  describe('resumePlayback', () => {
    test('should resume user playback', async () => {
      const resumePlaybackSpy = vi
        .spyOn(spotifyService.player, 'resumePlayback')
        .mockResolvedValue(true)

      expect(
        await usersPlaybackController.resumePlayback(accessTokenMock)
      ).toEqual({ success: true })

      expect(resumePlaybackSpy).toHaveBeenCalledWith(accessTokenMock)
    })
  })
})
