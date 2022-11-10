import { SpotifyDevice } from '../types'

const spotifyDeviceMock: SpotifyDevice = {
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
