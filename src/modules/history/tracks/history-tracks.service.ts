import { Injectable } from '@nestjs/common'
import { PlayHistory } from '@spotify/web-api-ts-sdk'

import { HistoryTrack } from './history-track.entity'
import { HistoryTracksRepository } from './history-tracks.repository'
import { CreateHistoryTrack } from './dtos'

import { TracksService } from '@modules/tracks'
import { User } from '@modules/users'

@Injectable()
export class HistoryTracksService {
  constructor(
    private readonly historyTracksRepository: HistoryTracksRepository,
    private readonly tracksService: TracksService
  ) {}

  public create(newHistoryTrack: CreateHistoryTrack): Promise<HistoryTrack>
  public create(playHistory: PlayHistory[], user: User): Promise<HistoryTrack[]>

  create(newHistoryTrack: CreateHistoryTrack | PlayHistory[], user?: User) {
    if (Array.isArray(newHistoryTrack) && user)
      return this.createHistoryTracksFromPlayHistory(newHistoryTrack, user)

    return this.historyTracksRepository.createHistoryTrack(
      newHistoryTrack as CreateHistoryTrack
    )
  }

  async createHistoryTracksFromPlayHistory(
    playHistory: PlayHistory[],
    user: User
  ) {
    const tracks = await this.tracksService.findOrCreate(
      playHistory.map(({ track }) => track)
    )

    const historyTracks: HistoryTrack[] = []

    for (const track of tracks) {
      const playedAt = new Date(
        playHistory.find(
          ({ track: { id } }) => id === track.externalId
        )!.played_at
      )

      const newHistoryTrack =
        await this.historyTracksRepository.createHistoryTrack({
          user,
          playedAt,
          track,
        })

      historyTracks.push(newHistoryTrack)
    }

    return historyTracks
  }
}
