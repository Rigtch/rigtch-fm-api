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
  @ApiProperty({
    type: Number,
    example: 300,
    description: 'The image height in pixels.',
  })
  height: number

  @Column('int')
  @ApiProperty({
    type: Number,
    example: 300,
    description: 'The image width in pixels.',
  })
  width: number

  @Column('varchar')
  @ApiProperty({
    example: 'https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228',
    description: 'The source URL of the image.',
  })
  url: string
}
