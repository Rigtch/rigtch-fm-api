import { Injectable } from '@nestjs/common'

import {
  SpotifyArtist,
  FormattedArtist,
  FormattedTrack,
  SpotifyTrack,
  FormattedProfile,
  SpotifyProfile,
  SpotifyDevice,
  FormattedDevice,
  SpotifyPlaybackState,
  FormattedPlaybackState,
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
    return tracks.map(
      ({ name, album, artists, href, duration_ms, progress_ms }) => ({
        name,
        album: { name: album.name, images: album.images },
        artists: artists.map(({ name }) => name),
        href,
        duration: duration_ms,
        ...(progress_ms && { progress: progress_ms }),
      })
    )
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

  formatDevices(devices: SpotifyDevice[]): FormattedDevice[] {
    return devices.map(
      ({
        id,
        name,
        type,
        is_active: isActive,
        is_private_session: isPrivateSession,
        is_restricted: isRestricted,
        volume_percent: volumePercent,
      }) => ({
        id,
        name,
        type,
        isActive,
        isPrivateSession,
        isRestricted,
        volumePercent,
      })
    )
  }

  formatPlaybackState = ({
    device,
    repeat_state,
    shuffle_state,
    is_playing,
    item,
  }: SpotifyPlaybackState): FormattedPlaybackState => {
    const [formattedDevice] = this.formatDevices([device])
    const [formattedTrack] = this.formatTracks([item])

    return {
      device: formattedDevice,
      repeatState: repeat_state,
      shuffleState: shuffle_state,
      isPlaying: is_playing,
      track: formattedTrack,
    }
  }
}
