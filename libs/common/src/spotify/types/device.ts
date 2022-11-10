export interface FormattedDevice {
  id: string
  name: string
  type: string
  isActive: boolean
  isPrivateSession: boolean
  isRestricted: boolean
  volumePercent: number
}

export interface SpotifyDevice {
  id: string
  is_active: boolean
  is_private_session: boolean
  is_restricted: boolean
  name: string
  type: string
  volume_percent: number
}
