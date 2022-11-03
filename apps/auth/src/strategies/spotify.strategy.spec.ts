import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'

import { SpotifyStrategy } from './spotify.strategy'

describe('SpotifyStrategy', () => {
  let spotifyStrategy: SpotifyStrategy

  beforeEach(async () => {
    jest.resetModules()

    process.env = {
      SPOTIFY_CLIENT_ID: '1234',
      SPOTIFY_CLIENT_SECRET: '5678',
      SPOTIFY_CALLBACK_URL: '/',
    }

    const spotifyStrategyModule: TestingModule = await Test.createTestingModule(
      {
        providers: [
          SpotifyStrategy,
          {
            provide: ConfigService,
            useValue: {
              get: jest.fn().mockReturnValue('env variable'),
            },
          },
        ],
      }
    ).compile()

    spotifyStrategy = spotifyStrategyModule.get(SpotifyStrategy)
  })

  it('should be defined', () => {
    expect(spotifyStrategy).toBeDefined()
  })
})
