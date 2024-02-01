import { Injectable } from '@nestjs/common'

import { Device, SdkDevice } from '@common/types/spotify'

@Injectable()
export class DevicesAdapter {
  public adapt(data: SdkDevice[]): Device[]
  public adapt(data: SdkDevice): Device

  adapt(data: SdkDevice | SdkDevice[]) {
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
  }: SdkDevice): Device => ({
    id,
    name,
    type,
    isActive,
    isPrivateSession,
    isRestricted,
    volumePercent,
  })
}
