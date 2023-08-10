import { expect, test, describe } from 'vitest'

import { spotifyDevicesMock, formattedDevicesMock } from '../mocks'

import { adaptDevices } from './devices.adapter'

describe('adaptDevices', () => {
  test('should adapt devices', () => {
    expect(adaptDevices(spotifyDevicesMock)).toEqual(formattedDevicesMock)
  })
})
