import { Injectable } from '@nestjs/common'

import {
  SpotifyArtist,
  FormattedArtist,
  FormattedTrack,
  SpotifyTrack,
  FormattedProfile,
  SpotifyProfile,
} from './types'

@Injectable()
export class SpotifyService {
  formatArtists(artists: SpotifyArtist[]): FormattedArtist[] {
    return artists.map(({ name, genres, href, images }) => ({
      name,
      genres,
      href,
      images,
    }))
  }

  formatTracks(tracks: SpotifyTrack[]): FormattedTrack[] {
    return tracks.map(({ name, album, artists, href }) => ({
      name,
      album: { name: album.name, images: album.images },
      artists: artists.map(({ name }) => name),
      href,
    }))
  }

  formatProfile({
    id,
    display_name,
    email,
    images,
    country,
    uri,
    followers,
  }: SpotifyProfile): FormattedProfile {
    return {
      id,
      displayName: display_name,
      email,
      images,
      country,
      uri,
      followers: followers.total,
    }
  }
}
