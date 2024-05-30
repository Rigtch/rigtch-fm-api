import { Injectable, Logger } from '@nestjs/common'
import { PlayHistory } from '@spotify/web-api-ts-sdk'
import { DataSource } from 'typeorm'

import { HistoryTrack } from './history-track.entity'
import { CreateHistoryTrack } from './dtos'

import { User } from '@modules/users/user.entity'
import { ItemsService } from '@modules/items'
import { removeDuplicates } from '@common/utils'

@Injectable()
export class HistoryTracksService {
  private readonly logger = new Logger(HistoryTracksService.name)

  constructor(
    private readonly dataSource: DataSource,
    private readonly itemsService: ItemsService
  ) {}

  public create(newHistoryTrack: CreateHistoryTrack): Promise<HistoryTrack>
  public create(playHistory: PlayHistory[], user: User): Promise<HistoryTrack[]>

  create(data: CreateHistoryTrack | PlayHistory[], user?: User) {
    if (Array.isArray(data) && user)
      return this.createFromPlayHistory(data, user)
    else if (!Array.isArray(data)) return this.findOrCreateOne(data)
  }

  private async createFromPlayHistory(playHistory: PlayHistory[], user: User) {
    this.logger.log(
      `PlayHistory length for user ${user.profile.displayName}: ${removeDuplicates(playHistory.map(({ track }) => track.id)).length}`
    )

    const tracks = await this.itemsService.findOrCreate(
      playHistory.map(({ track }) => track)
    )

    this.logger.log(
      `Found tracks length for user ${user.profile.displayName}: ${tracks.length}`
    )

    if (tracks.length === 0) return []

    const historyTracks: HistoryTrack[] = []

    for (const {
      track: { id },
      played_at,
    } of playHistory) {
      const track = tracks.find(track => track.externalId === id)

      if (!track) continue

      const historyTrack = await this.findOrCreateOne({
        track,
        user,
        playedAt: new Date(played_at),
      })

      historyTracks.push(historyTrack)
    }

    return historyTracks
  }

  private findOrCreateOne({
    track,
    user,
    playedAt,
  }: CreateHistoryTrack): Promise<HistoryTrack> {
    return this.dataSource.transaction(async manager => {
      const foundHistoryTracks = await manager.findBy(HistoryTrack, {
        user: {
          id: user.id,
        },
        track: {
          id: track.id,
        },
      })

      for (const foundHistoryTrack of foundHistoryTracks)
        if (foundHistoryTrack.playedAt.getTime() === playedAt.getTime())
          return foundHistoryTrack

      const newHistoryTrack = manager.create(HistoryTrack, {
        user,
        track,
        playedAt,
      })

      return manager.save(newHistoryTrack)
    })
  }
}
