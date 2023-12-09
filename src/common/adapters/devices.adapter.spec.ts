import { spotifyDevicesMock, devicesMock } from '../mocks'

import { adaptDevices } from './devices.adapter'

describe('adaptDevices', () => {
  test('should adapt devices', () => {
    expect(adaptDevices(spotifyDevicesMock)).toEqual(devicesMock)
  })
})
