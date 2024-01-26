import { Injectable } from '@nestjs/common'

import { Profile, SdkProfile } from '@common/types/spotify'

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
  }: SdkProfile): Profile => ({
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
