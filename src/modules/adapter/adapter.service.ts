import { Injectable } from '@nestjs/common'

import { Genres } from '~/common/dtos'
import {
  SpotifyArtist,
  FormattedArtist,
  SpotifyTrack,
  FormattedTrack,
  SpotifyProfile,
  FormattedProfile,
  SpotifyDevice,
  FormattedDevice,
  SpotifyPlaybackState,
  FormattedPlaybackState,
} from '~/common/types/spotify'
import { getMostFrequentItems } from '~/utils'

@Injectable()
export class AdapterService {
  adaptArtists(artists: SpotifyArtist[]): FormattedArtist[] {
    return artists.map(({ name, genres, href, images }) => ({
      name,
      genres,
      href,
      images,
    }))
  }

  adaptGenres(artists: SpotifyArtist[], limit: number): Genres {
    return {
      genres: getMostFrequentItems(
        artists.flatMap(({ genres }) => genres),
        limit
      ),
    }
  }

  adaptTracks(tracks: SpotifyTrack[]): FormattedTrack[] {
    return tracks.map(
      ({
        name,
        album,
        artists,
        external_urls: { spotify: href },
        duration_ms,
        progress_ms,
        played_at,
      }) => ({
        name,
        album: { name: album.name, images: album.images },
        artists: artists.map(({ name, id, href }) => ({ name, id, href })),
        href,
        duration: duration_ms,
        ...(progress_ms && { progress: progress_ms }),
        ...(played_at && { playedAt: played_at }),
      })
    )
  }

  adaptProfile({
    id,
    display_name,
    email,
    images,
    country,
    external_urls: { spotify: href },
    followers,
  }: SpotifyProfile): FormattedProfile {
    return {
      id,
      displayName: display_name,
      email,
      images,
      country,
      href,
      followers: followers.total,
    }
  }

  adaptDevices(devices: SpotifyDevice[]): FormattedDevice[] {
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

  adaptPlaybackState = ({
    device,
    repeat_state,
    shuffle_state,
    is_playing,
    item,
  }: SpotifyPlaybackState): FormattedPlaybackState => {
    const [formattedDevice] = this.adaptDevices([device])
    const [formattedTrack] = this.adaptTracks([item])

    return {
      device: formattedDevice,
      repeatState: repeat_state,
      shuffleState: shuffle_state,
      isPlaying: is_playing,
      track: formattedTrack,
    }
  }
}
