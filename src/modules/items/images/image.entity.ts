import { ApiProperty } from '@nestjs/swagger'
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm'

import { SdkImage } from '@common/types/spotify'

@Entity()
@Unique('IMAGE_UNIQUE', ['url'])
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

  @Column('varchar')
  @ApiProperty()
  url: string
}
