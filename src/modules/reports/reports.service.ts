import { Injectable } from '@nestjs/common'
import { Simplify } from 'type-fest'

import type {
  ReportsTotalItemsQuery,
  ReportsListeningQuery,
} from './router/dtos'
import { ListeningDaysDocument } from './router/docs'

import {
  type HistoryTrack,
  HistoryTracksRepository,
} from '@modules/history/tracks'
import type { User } from '@modules/users'
import { removeDuplicates } from '@common/utils'
import { StatsMeasurement } from '@modules/stats/enums'
import type { Track } from '@modules/items/tracks'
import type { Album } from '@modules/items/albums'
import type { Artist } from '@modules/items/artists'

type PickedHistoryTrackWithTrackDuration = Simplify<
  Pick<HistoryTrack, 'playedAt'> & {
    track: Pick<Track, 'duration'>
  }
>

type PickedHistoryTrackWithTrackArtists = Simplify<{
  track: {
    artists: Pick<Artist, 'externalId'>[]
  }
}>

type PickedHistoryTrackWithTrackAlbum = Simplify<{
  track: {
    album: Pick<Album, 'externalId'>
  }
}>

@Injectable()
export class ReportsService {
  constructor(
    private readonly historyTracksRepository: HistoryTracksRepository
  ) {}

  async getListeningDays(
    { before, after, measurement }: Required<ReportsListeningQuery>,
    user: User
  ) {
    const timeRangeTimestamp = before.getTime() - after.getTime()
    const timeRangeDays = Math.floor(timeRangeTimestamp / (1000 * 60 * 60 * 24))

    const listeningDaysArray: ListeningDaysDocument[] = []

    for (let index = 0; index < timeRangeDays; index++) {
      const afterParam = new Date(after.getTime() + 1000 * 60 * 60 * 24 * index)
      const beforeParam = new Date(afterParam.getTime() + 1000 * 60 * 60 * 24)

      if (measurement === StatsMeasurement.PLAYS) {
        listeningDaysArray.push({
          date: afterParam,
          dayIndex: index + 1,
          value: await this.historyTracksRepository.countByUserAndBetweenDates(
            user.id,
            afterParam,
            beforeParam
          ),
        })
      } else {
        const historyTracks =
          await this.historyTracksRepository.findByUserAndBetweenDates<PickedHistoryTrackWithTrackDuration>(
            user.id,
            afterParam,
            beforeParam,
            {
              track: {
                album: false,
                artists: false,
              },
            },
            {
              playedAt: true,
              track: {
                duration: true,
              },
            }
          )

        const tracksDurations = historyTracks.map(({ track }) => track.duration)

        listeningDaysArray.push({
          date: afterParam,
          dayIndex: index + 1,
          value: tracksDurations.reduce(
            (previousValue, currentValue) => previousValue + currentValue,
            0
          ),
        })
      }
    }

    return listeningDaysArray
  }

  async getListeningHours(
    { before, after, measurement }: Required<ReportsListeningQuery>,
    user: User
  ) {
    const historyTracks =
      await this.historyTracksRepository.findByUserAndBetweenDates<PickedHistoryTrackWithTrackDuration>(
        user.id,
        after,
        before,
        {
          track: {
            album: false,
            artists: false,
          },
        },
        {
          playedAt: true,
          track: {
            duration: true,
          },
        }
      )

    const listeningHoursObject: Record<number, number> = {}

    const DAY_HOURS = 24

    for (let index = 0; index < DAY_HOURS; index++) {
      const historyTracksWithinSearchedHour = historyTracks.filter(
        ({ playedAt }) => playedAt.getHours() === index
      )

      if (measurement === StatsMeasurement.PLAYS) {
        listeningHoursObject[index] = historyTracksWithinSearchedHour.length
      } else {
        const tracksDurations = historyTracksWithinSearchedHour.map(
          ({ track }) => track.duration
        )

        listeningHoursObject[index] = tracksDurations.reduce(
          (previousDuration, currentDuration) =>
            previousDuration + currentDuration,
          0
        )
      }
    }

    return listeningHoursObject
  }

  getTotalTracks(
    { before, after }: Required<ReportsTotalItemsQuery>,
    user: User
  ) {
    return this.historyTracksRepository.countByUserAndBetweenDates(
      user.id,
      after,
      before
    )
  }

  async getTotalArtists(
    { before, after }: Required<ReportsTotalItemsQuery>,
    user: User
  ) {
    const historyTracks =
      await this.historyTracksRepository.findByUserAndBetweenDates<PickedHistoryTrackWithTrackArtists>(
        user.id,
        after,
        before,
        {
          track: {
            artists: {
              images: false,
            },
            album: false,
          },
        },
        {
          track: {
            artists: {
              externalId: true,
            },
          },
        }
      )

    const artistsExternalIds = historyTracks.flatMap(({ track }) =>
      track.artists.map(({ externalId }) => externalId)
    )

    return removeDuplicates(artistsExternalIds).length
  }

  async getTotalAlbums(
    { before, after }: Required<ReportsTotalItemsQuery>,
    user: User
  ) {
    const historyTracks =
      await this.historyTracksRepository.findByUserAndBetweenDates<PickedHistoryTrackWithTrackAlbum>(
        user.id,
        after,
        before,
        {
          track: {
            album: {
              images: false,
              artists: false,
              tracks: false,
            },
          },
        },
        {
          track: {
            album: {
              externalId: true,
            },
          },
        }
      )

    const albumsExternalIds = historyTracks.flatMap(
      ({ track }) => track.album.externalId
    )

    return removeDuplicates(albumsExternalIds).length
  }
}
