import { Device, SdkDevice } from '../types/spotify'

export const sdkDeviceMock: SdkDevice = {
  id: 'id',
  is_active: true,
  is_private_session: false,
  is_restricted: false,
  name: 'name',
  type: 'type',
  volume_percent: 100,
}

export const sdkDevicesMock: SdkDevice[] = Array.from(
  { length: 5 },
  () => sdkDeviceMock
)

export const deviceMock: Device = {
  id: sdkDeviceMock.id,
  name: sdkDeviceMock.name,
  type: sdkDeviceMock.type,
  isActive: sdkDeviceMock.is_active,
  isPrivateSession: sdkDeviceMock.is_private_session,
  isRestricted: sdkDeviceMock.is_restricted,
  volumePercent: sdkDeviceMock.volume_percent,
}

export const devicesMock: Device[] = Array.from({ length: 5 }, () => deviceMock)
