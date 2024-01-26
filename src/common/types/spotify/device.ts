export interface Device {
  id: string | null
  name: string
  type: string
  isActive: boolean
  isPrivateSession: boolean
  isRestricted: boolean
  volumePercent: number | null
}

export { Device as SdkDevice } from '@spotify/web-api-ts-sdk'
