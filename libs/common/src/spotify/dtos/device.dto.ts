import { Field, ObjectType } from '@nestjs/graphql'

import { FormattedDevice } from '@lib/common'

@ObjectType()
export abstract class Device implements FormattedDevice {
  @Field(() => String)
  id: string

  @Field(() => String)
  name: string

  @Field(() => String)
  type: string

  @Field(() => Boolean)
  isActive: boolean

  @Field(() => Boolean)
  isPrivateSession: boolean

  @Field(() => Boolean)
  isRestricted: boolean

  @Field(() => Number)
  volumePercent: number
}
