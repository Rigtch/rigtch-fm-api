export interface Device {
  id?: string | null
  name: string
  type: string
  isActive: boolean
  isPrivateSession: boolean
  isRestricted: boolean
  volumePercent?: number | null
}

export interface SpotifyDevice {
  id?: string | null
  is_active: boolean
  is_private_session: boolean
  is_restricted: boolean
  name: string
  type: string
  volume_percent?: number | null
}
