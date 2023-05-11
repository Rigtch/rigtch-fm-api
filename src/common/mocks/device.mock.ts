import { FormattedDevice, SpotifyDevice } from '../types/spotify'

export const spotifyDeviceMock: SpotifyDevice = {
  id: 'id',
  is_active: true,
  is_private_session: false,
  is_restricted: false,
  name: 'name',
  type: 'type',
  volume_percent: 100,
}

export const spotifyDevicesMock: SpotifyDevice[] = Array.from(
  { length: 5 },
  () => spotifyDeviceMock
)

export const formattedDeviceMock: FormattedDevice = {
  id: 'id',
  name: 'name',
  type: 'type',
  isActive: true,
  isPrivateSession: false,
  isRestricted: false,
  volumePercent: 100,
}

export const formattedDevicesMock: FormattedDevice[] = Array.from(
  { length: 5 },
  () => formattedDeviceMock
)
