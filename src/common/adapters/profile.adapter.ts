import { Injectable } from '@nestjs/common'
import { UserProfile } from '@spotify/web-api-ts-sdk'

import { Profile } from '@common/types/spotify'

@Injectable()
export class ProfileAdapter {
  adapt = ({
    id,
    display_name,
    email,
    images,
    country,
    product,
    type,
    uri,
    external_urls: { spotify: href },
    followers,
  }: UserProfile): Profile => ({
    id,
    displayName: display_name,
    email,
    images,
    country,
    href,
    product,
    type,
    uri,
    followers: followers.total,
  })
}
