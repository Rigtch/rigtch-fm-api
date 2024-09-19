import { Injectable } from '@nestjs/common'

import { ListeningDaysDocument } from './router/docs'
import type {
  ReportsListeningQuery,
  ReportsTotalItemsQuery,
} from './router/dtos'
import type {
  PickedHistoryTrackWithTrackDuration,
  PickedHistoryTrackWithTrackDurationAndPlayedAt,
  PickedHistoryTrackWithArtistsExternalIds,
  PickedHistoryTrackWithAlbumExternalId,
} from './types'

import { removeDuplicates } from '@common/utils'
import { HistoryTracksRepository } from '@modules/history/tracks'
import { StatsMeasurement } from '@modules/stats/enums'
import type { User } from '@modules/users'

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
              track: true,
            },
            {
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
            (previousDuration, currentDuration) =>
              previousDuration + currentDuration,
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
      await this.historyTracksRepository.findByUserAndBetweenDates<PickedHistoryTrackWithTrackDurationAndPlayedAt>(
        user.id,
        after,
        before,
        {
          track: true,
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
      await this.historyTracksRepository.findByUserAndBetweenDates<PickedHistoryTrackWithArtistsExternalIds>(
        user.id,
        after,
        before,
        {
          track: {
            artists: true,
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
      await this.historyTracksRepository.findByUserAndBetweenDates<PickedHistoryTrackWithAlbumExternalId>(
        user.id,
        after,
        before,
        {
          track: {
            album: true,
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
