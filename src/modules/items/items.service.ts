import { Injectable } from '@nestjs/common'

import { AlbumsRepository, AlbumsService } from './albums'
import { Artist, ArtistsRepository, ArtistsService } from './artists'
import { Track, TracksRepository, TracksService } from './tracks'
import { sdkItemFilterPredicate } from './utils'

import { removeDuplicates } from '@common/utils'
import { ImagesService } from '@modules/items/images'
import { SdkArtist, SdkTrack } from '@common/types/spotify'
import { SpotifyService } from '@modules/spotify'

@Injectable()
export class ItemsService {
  constructor(
    private readonly albumsService: AlbumsService,
    private readonly albumsRepository: AlbumsRepository,
    private readonly artistsService: ArtistsService,
    private readonly artistsRepository: ArtistsRepository,
    private readonly tracksService: TracksService,
    private readonly tracksRepository: TracksRepository,
    private readonly imagesService: ImagesService,
    private readonly spotifyService: SpotifyService
  ) {}

  public findOrCreate(tracks: SdkTrack[]): Promise<Track[]>
  public findOrCreate(artists: SdkArtist[]): Promise<Artist[]>

  async findOrCreate(items: SdkTrack[] | SdkArtist[]) {
    if (items.length === 0) return []

    if ('artists' in items[0])
      return this.findOrCreateTracks(items as SdkTrack[])
    return this.findOrCreateArtists(items as SdkArtist[])
  }

  private async findOrCreateArtists(artists: SdkArtist[]) {
    const artistsExternalIds = removeDuplicates(artists.map(({ id }) => id))

    const filteredArtists = await this.getFilteredArtists(artistsExternalIds)

    const images = filteredArtists.flatMap(({ images }) => images)

    if (images.length > 0) await this.imagesService.findOrCreate(images)

    await this.artistsService.updateOrCreate(filteredArtists)

    return this.artistsRepository.findArtistsByExternalIds(artistsExternalIds)
  }

  private async findOrCreateTracks(tracks: SdkTrack[]) {
    const filteredArtists = await this.getFilteredArtists(
      removeDuplicates(
        tracks.flatMap(({ artists }) => artists.map(({ id }) => id))
      )
    )

    const filteredAlbums = await this.getFilteredAlbums(
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

  private async getFilteredArtists(artistsExternalIds: string[]) {
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

  private async getFilteredAlbums(albumsExternalIds: string[]) {
    const foundAlbums =
      await this.albumsRepository.findAlbumsByExternalIds(albumsExternalIds)
    const fetchedAlbums = await this.spotifyService.albums.get(
      albumsExternalIds,
      false
    )

    for await (const foundAlbum of foundAlbums) {
      if (foundAlbum.tracks?.length === 0) {
        const fetchedAlbum = fetchedAlbums.find(
          ({ id }) => id === foundAlbum.externalId
        )!

        foundAlbum.tracks = await this.tracksService.updateOrCreate(
          fetchedAlbum.tracks.items.map(track => ({
            ...track,
            album: fetchedAlbum,
          }))
        )

        await this.albumsRepository.save(foundAlbum)
      }
    }

    return fetchedAlbums.filter(({ id }) =>
      sdkItemFilterPredicate(id, foundAlbums)
    )
  }
}
