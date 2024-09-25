import { ApiProperty, OmitType, PickType } from '@nestjs/swagger'

import { User } from '../user.entity'

import { ProfileDocument } from '@modules/profiles/docs'

export class UserDocument extends OmitType(User, [
  'followers',
  'following',
  'refreshToken',
  'profile',
]) {
  @ApiProperty({ type: ProfileDocument })
  readonly profile: ProfileDocument
}

export abstract class SimplifiedUserDocument extends OmitType(UserDocument, [
  'followersCount',
  'followingCount',
  'createdAt',
]) {}

export abstract class UserFollowersDocument extends PickType(UserDocument, [
  'id',
]) {
  @ApiProperty({ type: [SimplifiedUserDocument] })
  readonly followers: SimplifiedUserDocument[]
}

export abstract class UserFollowingDocument extends PickType(UserDocument, [
  'id',
]) {
  @ApiProperty({ type: [SimplifiedUserDocument] })
  readonly following: SimplifiedUserDocument[]
}
