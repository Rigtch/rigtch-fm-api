import { Injectable } from '@nestjs/common'

import { AlbumsRepository, AlbumsService } from './albums'
import { ArtistsRepository, ArtistsService } from './artists'
import { TracksRepository } from './tracks'
import { sdkItemFilterPredicate } from './utils'

import { removeDuplicates } from '@common/utils'
import { ImagesService } from '@modules/items/images'
import { SdkTrack } from '@common/types/spotify'
import { SpotifyService } from '@modules/spotify'

@Injectable()
export class ItemsService {
  constructor(
    private readonly albumsService: AlbumsService,
    private readonly albumsRepository: AlbumsRepository,
    private readonly artistsService: ArtistsService,
    private readonly artistsRepository: ArtistsRepository,
    private readonly tracksRepository: TracksRepository,
    private readonly imagesService: ImagesService,

    private readonly spotifyService: SpotifyService
  ) {}

  async findOrCreate(tracks: SdkTrack[]) {
    if (tracks.length === 0) return []

    const filteredArtists = await this.getFilteredArtistExternalIds(
      removeDuplicates(
        tracks.flatMap(({ artists }) => artists.map(({ id }) => id))
      )
    )
    const filteredAlbums = await this.getFilteredAlbumExternalIds(
      removeDuplicates(tracks.map(({ album }) => album.id))
    )

    const images = [
      ...filteredArtists.flatMap(({ images }) => images),
      ...filteredAlbums.flatMap(({ images }) => images),
    ]

    if (images.length > 0) await this.imagesService.findOrCreate(images)
    if (filteredArtists.length > 0)
      await this.artistsService.updateOrCreate(filteredArtists)
    if (filteredAlbums.length > 0)
      await this.albumsService.updateOrCreate(filteredAlbums)

    return this.tracksRepository.findTracksByExternalIds(
      removeDuplicates(tracks.map(({ id }) => id))
    )
  }

  private async getFilteredArtistExternalIds(artistsExternalIds: string[]) {
    const foundArtists =
      await this.artistsRepository.findArtistsByExternalIds(artistsExternalIds)
    const fetchedArtists = await this.spotifyService.artists.get(
      artistsExternalIds,
      false
    )
    return fetchedArtists.filter(({ id }) =>
      sdkItemFilterPredicate(id, foundArtists)
    )
  }

  private async getFilteredAlbumExternalIds(albumsExternalIds: string[]) {
    const foundAlbums =
      await this.albumsRepository.findAlbumsByExternalIds(albumsExternalIds)
    const fetchedAlbums = await this.spotifyService.albums.get(
      albumsExternalIds,
      false
    )
    return fetchedAlbums.filter(({ id }) =>
      sdkItemFilterPredicate(id, foundAlbums)
    )
  }
}
