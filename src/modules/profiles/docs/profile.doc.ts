import { ApiProperty, PickType } from '@nestjs/swagger'

import { Profile } from '../profile.entity'

import { ImageDocument } from '@modules/items/images/docs'

export abstract class ProfileDocument extends PickType(Profile, [
  'displayName',
  'href',
]) {
  @ApiProperty({ type: [ImageDocument] })
  images: ImageDocument[]
}
