import { Injectable } from '@nestjs/common'

import {
  FormattedAudioFeatures,
  SpotifyAudioFeatures,
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
} from '@common/types/spotify'
import { Genres } from '@common/dtos'
import { getMostFrequentItems } from '~/utils'

@Injectable()
export class AdapterService {
  adaptArtist = ({
    id,
    name,
    genres,
    external_urls: { spotify: href },
    images,
  }: SpotifyArtist): FormattedArtist => ({
    id,
    name,
    genres,
    href,
    images,
  })

  adaptArtists = (artists: SpotifyArtist[]): FormattedArtist[] =>
    artists.map(artist => this.adaptArtist(artist))

  adaptGenres = (artists: SpotifyArtist[], limit: number): Genres => ({
    genres: getMostFrequentItems(
      artists.flatMap(({ genres }) => genres),
      limit
    ),
  })

  adaptTrack = ({
    id,
    name,
    album,
    artists,
    external_urls: { spotify: href },
    duration_ms,
    progress_ms,
    played_at,
  }: SpotifyTrack): FormattedTrack => ({
    id,
    name,
    album: { name: album.name, images: album.images },
    artists: artists.map(({ name, id, href }) => ({ name, id, href })),
    href,
    duration: duration_ms,
    ...(progress_ms && { progress: progress_ms }),
    ...(played_at && { playedAt: played_at }),
  })

  adaptTracks = (tracks: SpotifyTrack[]): FormattedTrack[] =>
    tracks.map(track => this.adaptTrack(track))

  adaptProfile = ({
    id,
    display_name,
    email,
    images,
    country,
    external_urls: { spotify: href },
    followers,
  }: SpotifyProfile): FormattedProfile => ({
    id,
    displayName: display_name,
    email,
    images,
    country,
    href,
    followers: followers.total,
  })

  adaptDevices = (devices: SpotifyDevice[]): FormattedDevice[] =>
    devices.map(
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

  adaptAudioFeatures = ({
    id,
    track_href,
    danceability,
    acousticness,
    instrumentalness,
    speechiness,
    liveness,
    loudness,
    energy,
    tempo,
    mode,
    key,
    valence,
  }: SpotifyAudioFeatures): FormattedAudioFeatures => ({
    id,
    trackHref: track_href,
    danceability,
    acousticness,
    instrumentalness,
    speechiness,
    liveness,
    loudness,
    energy,
    tempo,
    mode,
    key,
    valence,
  })
}
