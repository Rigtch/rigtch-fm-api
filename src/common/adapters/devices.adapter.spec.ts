import { Test } from '@nestjs/testing'

import { DevicesAdapter } from './devices.adapter'

import { deviceMock, spotifyDeviceMock } from '@common/mocks'

describe('DevicesAdapter', () => {
  let devicesAdapter: DevicesAdapter

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [DevicesAdapter],
    }).compile()

    devicesAdapter = module.get(DevicesAdapter)
  })

  test('should be defined', () => {
    expect(devicesAdapter).toBeDefined()
  })

  test('should adapt a single device', () => {
    expect(devicesAdapter.adapt(spotifyDeviceMock)).toEqual(deviceMock)
  })

  test('should adapt an array of devices', () => {
    expect(devicesAdapter.adapt([spotifyDeviceMock])).toEqual([deviceMock])
  })
})
