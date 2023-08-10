import { FormattedDevice, SpotifyDevice } from '../types/spotify'

export const adaptDevices = (devices: SpotifyDevice[]): FormattedDevice[] =>
  devices.map(
    ({
      id,
      name,
      type,
      is_active: isActive,
      is_private_session: isPrivateSession,
      is_restricted: isRestricted,
      volume_percent: volumePercent,
    }) => ({
      id,
      name,
      type,
      isActive,
      isPrivateSession,
      isRestricted,
      volumePercent,
    })
  )