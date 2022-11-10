import { FormattedDevice } from '../types'

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
