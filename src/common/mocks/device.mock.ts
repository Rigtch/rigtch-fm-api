import { Device, SpotifyDevice } from '../types/spotify'

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

export const deviceMock: Device = {
  id: spotifyDeviceMock.id,
  name: spotifyDeviceMock.name,
  type: spotifyDeviceMock.type,
  isActive: spotifyDeviceMock.is_active,
  isPrivateSession: spotifyDeviceMock.is_private_session,
  isRestricted: spotifyDeviceMock.is_restricted,
  volumePercent: spotifyDeviceMock.volume_percent,
}

export const devicesMock: Device[] = Array.from({ length: 5 }, () => deviceMock)
