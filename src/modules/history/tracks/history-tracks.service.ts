import { Injectable } from '@nestjs/common'
import { PlayHistory } from '@spotify/web-api-ts-sdk'
import { DataSource } from 'typeorm'

import { HistoryTrack } from './history-track.entity'
import { HistoryTracksRepository } from './history-tracks.repository'
import { CreateHistoryTrack } from './dtos'

import { User } from '@modules/users'
import { ItemsService } from '@modules/items'

@Injectable()
export class HistoryTracksService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly historyTracksRepository: HistoryTracksRepository,
    private readonly itemsService: ItemsService
  ) {}

  public create(newHistoryTrack: CreateHistoryTrack): Promise<HistoryTrack>
  public create(playHistory: PlayHistory[], user: User): Promise<HistoryTrack[]>

  create(data: CreateHistoryTrack | PlayHistory[], user?: User) {
    if (Array.isArray(data) && user)
      return this.createHistoryTracksFromPlayHistory(data, user)

    return this.historyTracksRepository.createHistoryTrack(
      data as CreateHistoryTrack
    )
  }

  private async createHistoryTracksFromPlayHistory(
    playHistory: PlayHistory[],
    user: User
  ) {
    const tracks = await this.itemsService.findOrCreate(
      playHistory.map(({ track }) => track)
    )

    if (tracks.length === 0) return []

    const historyTracks: HistoryTrack[] = []

    for (const {
      track: { id },
      played_at,
    } of playHistory) {
      const track = tracks.find(track => track.externalId === id)

      if (!track) continue

      const playedAt = new Date(played_at)

      const historyTrack = await this.dataSource.transaction(async manager => {
        const foundHistoryTrack = await manager.findOneBy(HistoryTrack, {
          user: {
            id: user.id,
          },
          track: {
            id: track.id,
          },
          playedAt,
        })

        if (foundHistoryTrack?.playedAt.getTime() === playedAt.getTime())
          return foundHistoryTrack

        const newHistoryTrack = manager.create(HistoryTrack, {
          user,
          track,
          playedAt,
        })

        return manager.save(newHistoryTrack)
      })

      historyTracks.push(historyTrack)
    }

    return historyTracks
  }
}
