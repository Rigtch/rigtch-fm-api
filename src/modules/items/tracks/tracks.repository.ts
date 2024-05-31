import { Injectable } from '@nestjs/common'
import { DataSource, FindOptionsRelations, In, Repository } from 'typeorm'

import { Track } from './track.entity'
import { CreateTrack } from './dtos'

export const tracksRelations: FindOptionsRelations<Track> = {
  album: true,
  artists: true,
}

export const simplifiedTracksRelations: FindOptionsRelations<Track> = {
  artists: true,
}

@Injectable()
export class TracksRepository extends Repository<Track> {
  constructor(private readonly dataSource: DataSource) {
    super(Track, dataSource.createEntityManager())
  }

  findTracks() {
    return this.find({
      relations: tracksRelations,
    })
  }

  findTrackByExternalId(externalId: string) {
    return this.findOne({
      where: { externalId },
      relations: tracksRelations,
    })
  }

  findTrackById(id: string) {
    return this.findOne({
      where: { id },
      relations: tracksRelations,
    })
  }

  findTrackByName(name: string) {
    return this.findOne({
      where: { name },
      relations: tracksRelations,
    })
  }

  findTracksByExternalIds(externalIds: string[]) {
    return this.find({
      where: { externalId: In(externalIds) },
      relations: tracksRelations,
    })
  }

  async createTrack(trackToCreate: CreateTrack) {
    const trackEntity = this.create(trackToCreate)

    return this.save(trackEntity)
  }
}
