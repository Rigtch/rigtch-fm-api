import { SdkImage } from '.'

export interface Profile {
  id: string
  displayName: string
  images?: SdkImage[]
  followers: number
  country?: string
  email?: string
  href: string
  product?: string
  type: string
  uri: string
}

export { UserProfile as SdkProfile } from '@spotify/web-api-ts-sdk'
