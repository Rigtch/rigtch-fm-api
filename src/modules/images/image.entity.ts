import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

import { SdkImage } from '@common/types/spotify'

@Entity()
export class Image implements SdkImage {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string

  @Column('int')
  @ApiProperty({ type: Number })
  height: number

  @Column('int')
  @ApiProperty({ type: Number })
  width: number

  @Column('varchar', {
    unique: true,
  })
  @ApiProperty()
  url: string
}
