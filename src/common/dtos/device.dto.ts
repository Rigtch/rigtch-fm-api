import { Field, ObjectType } from '@nestjs/graphql'
import { ApiProperty } from '@nestjs/swagger'

import { FormattedDevice } from '~/common/types/spotify'

@ObjectType()
export abstract class Device implements FormattedDevice {
  @Field(() => String)
  @ApiProperty()
  id: string

  @Field(() => String)
  @ApiProperty()
  name: string

  @Field(() => String)
  @ApiProperty()
  type: string

  @Field(() => Boolean)
  @ApiProperty({ type: Boolean })
  isActive: boolean

  @Field(() => Boolean)
  @ApiProperty({ type: Boolean })
  isPrivateSession: boolean

  @Field(() => Boolean)
  @ApiProperty({ type: Boolean })
  isRestricted: boolean

  @Field(() => Number)
  @ApiProperty({ type: Number })
  volumePercent: number
}
