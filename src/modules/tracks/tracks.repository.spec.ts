import { DataSource } from 'typeorm'
import { Test } from '@nestjs/testing'

import { TracksRepository } from './tracks.repository'

import { AlbumsRepository } from '@modules/albums'
import { ArtistsRepository } from '@modules/artists'
import { SpotifyTracksService } from '@modules/spotify/tracks'
import {
  albumEntityMock,
  artistEntitiesMock,
  trackEntityMock,
  trackMock,
} from '@common/mocks'

describe('TracksRepository', () => {
  let tracksRepository: TracksRepository
  let albumsRepository: AlbumsRepository
  let artistsRepository: ArtistsRepository
  let spotifyTracksService: SpotifyTracksService

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TracksRepository,
        {
          provide: DataSource,
          useValue: {
            createEntityManager: vi.fn(),
          },
        },
        {
          provide: AlbumsRepository,
          useValue: {
            findOrCreateAlbum: vi.fn(),
          },
        },
        {
          provide: ArtistsRepository,
          useValue: {
            findOrCreateArtists: vi.fn(),
          },
        },
        {
          provide: SpotifyTracksService,
          useValue: {
            getTrack: vi.fn(),
          },
        },
      ],
    }).compile()

    tracksRepository = module.get(TracksRepository)
    albumsRepository = module.get(AlbumsRepository)
    artistsRepository = module.get(ArtistsRepository)
    spotifyTracksService = module.get(SpotifyTracksService)
  })

  test('should be defined', () => {
    expect(tracksRepository).toBeDefined()
  })

  test('should create track', async () => {
    const findOrCreateAlbumSpy = vi
      .spyOn(albumsRepository, 'findOrCreateAlbum')
      .mockResolvedValue(albumEntityMock)
    const findOrCreateArtistsSpy = vi
      .spyOn(artistsRepository, 'findOrCreateArtists')
      .mockResolvedValue(artistEntitiesMock)
    const createSpy = vi
      .spyOn(tracksRepository, 'create')
      .mockReturnValue(trackEntityMock)
    const saveSpy = vi
      .spyOn(tracksRepository, 'save')
      .mockResolvedValue(trackEntityMock)

    expect(await tracksRepository.createTrack(trackMock)).toEqual(
      trackEntityMock
    )
    expect(findOrCreateAlbumSpy).toHaveBeenCalledWith(trackMock.album.id)
    expect(findOrCreateArtistsSpy).toHaveBeenCalledWith(
      trackMock.artists.map(artist => artist.id)
    )
    expect(createSpy).toHaveBeenCalled()
    expect(saveSpy).toHaveBeenCalledWith(trackEntityMock)
  })

  describe('findOrCreateTrack', () => {
    test('should find track', async () => {
      const findOneSpy = vi
        .spyOn(tracksRepository, 'findOne')
        .mockResolvedValue(trackEntityMock)

      expect(await tracksRepository.findOrCreateTrack(trackMock.id)).toEqual(
        trackEntityMock
      )
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { externalId: trackMock.id },
      })
    })

    test('should create track', async () => {
      const findOneSpy = vi
        .spyOn(tracksRepository, 'findOne')
        .mockResolvedValue(null)
      const getTrackSpy = vi
        .spyOn(spotifyTracksService, 'getTrack')
        .mockResolvedValue(trackMock)
      const createTrackSpy = vi
        .spyOn(tracksRepository, 'createTrack')
        .mockResolvedValue(trackEntityMock)

      expect(await tracksRepository.findOrCreateTrack(trackMock.id)).toEqual(
        trackEntityMock
      )
      expect(findOneSpy).toHaveBeenCalledWith({
        where: { externalId: trackMock.id },
      })
      expect(getTrackSpy).toHaveBeenCalledWith(trackMock.id)
      expect(createTrackSpy).toHaveBeenCalledWith(trackMock)
    })
  })

  test('should find or create tracks', async () => {
    const findOrCreateTrackSpy = vi
      .spyOn(tracksRepository, 'findOrCreateTrack')
      .mockResolvedValue(trackEntityMock)

    expect(await tracksRepository.findOrCreateTracks([trackMock.id])).toEqual([
      trackEntityMock,
    ])
    expect(findOrCreateTrackSpy).toHaveBeenCalledWith(trackMock.id)
  })
})
