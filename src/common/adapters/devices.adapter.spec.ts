import { Test, TestingModule } from '@nestjs/testing'

import { DevicesAdapter } from './devices.adapter'

import { deviceMock, sdkDeviceMock } from '@common/mocks'

describe('DevicesAdapter', () => {
  let moduleRef: TestingModule
  let devicesAdapter: DevicesAdapter

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [DevicesAdapter],
    }).compile()

    devicesAdapter = moduleRef.get(DevicesAdapter)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(devicesAdapter).toBeDefined()
  })

  test('should adapt a single device', () => {
    expect(devicesAdapter.adapt(sdkDeviceMock)).toEqual(deviceMock)
  })

  test('should adapt an array of devices', () => {
    expect(devicesAdapter.adapt([sdkDeviceMock])).toEqual([deviceMock])
  })
})
