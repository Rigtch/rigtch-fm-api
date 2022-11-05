import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'

import { formatArtists, formatTracks } from './utils'
import {
  FormattedTrack,
  FormattedArtist,
  SpotifyArtist,
  SpotifyResponse,
  SpotifyTrack,
} from './types'

const spotifyErrorMessage =
  'Something went wrong with fetching data from spotify API'

@Injectable()
export class StatisticsService {
  constructor(private readonly httpService: HttpService) {}

  getHello(): string {
    return 'Hello World!'
  }

  async getlastTracks(accessToken: string): Promise<FormattedTrack[]> {
    try {
      return firstValueFrom(
        this.httpService.get<SpotifyResponse<{ track: SpotifyTrack }>>(
          '/me/player/recently-played?limit=50&after=604800000',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
      )
        .then(response => response.data.items)
        .then(items => items.map(item => item.track))
        .then(formatTracks)
    } catch {
      throw new InternalServerErrorException(spotifyErrorMessage)
    }
  }

  async getTopArtists(accessToken: string): Promise<FormattedArtist[]> {
    try {
      return firstValueFrom(
        this.httpService.get<SpotifyResponse<SpotifyArtist>>(
          '/me/top/artists?limit=10',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
      )
        .then(response => response.data.items)
        .then(formatArtists)
    } catch {
      throw new InternalServerErrorException(spotifyErrorMessage)
    }
  }

  async getTopTracks(accessToken: string): Promise<FormattedTrack[]> {
    try {
      return firstValueFrom(
        this.httpService.get<SpotifyResponse<SpotifyTrack>>(
          '/me/top/artists?limit=10',
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
      )
        .then(response => response.data.items)
        .then(formatTracks)
    } catch {
      throw new InternalServerErrorException(spotifyErrorMessage)
    }
  }
}
