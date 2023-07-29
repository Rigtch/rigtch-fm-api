import { spotifyDevicesMock, formattedDevicesMock } from '../mocks'

import { adaptDevices } from './devices.adapter'

describe('adaptDevices', () => {
  it('should adapt devices', () => {
    expect(adaptDevices(spotifyDevicesMock)).toEqual(formattedDevicesMock)
  })
})
