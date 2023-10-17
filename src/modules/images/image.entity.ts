import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { SpotifyImage } from '~/common/types/spotify'

@Entity()
export class Image implements SpotifyImage {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string

  @Column('int')
  @ApiProperty({ type: Number })
  height: number

  @Column('int')
  @ApiProperty({ type: Number })
  width: number

  @Column()
  @ApiProperty()
  url: string
}