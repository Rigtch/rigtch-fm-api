import { Injectable } from '@nestjs/common'
import { Device as SpotifyDevice } from '@spotify/web-api-ts-sdk'

import { Device } from '@common/types/spotify'

@Injectable()
export class DevicesAdapter {
  public adapt(data: SpotifyDevice[]): Device[]
  public adapt(data: SpotifyDevice): Device

  adapt(data: SpotifyDevice | SpotifyDevice[]) {
    if (Array.isArray(data)) return data.map(device => this.adaptDevice(device))

    return this.adaptDevice(data)
  }

  adaptDevice = ({
    id,
    name,
    type,
    is_active: isActive,
    is_private_session: isPrivateSession,
    is_restricted: isRestricted,
    volume_percent: volumePercent,
  }: SpotifyDevice): Device => ({
    id,
    name,
    type,
    isActive,
    isPrivateSession,
    isRestricted,
    volumePercent,
  })
}
