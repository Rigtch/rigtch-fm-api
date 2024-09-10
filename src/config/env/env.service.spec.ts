import { Test, TestingModule } from '@nestjs/testing'
import { ConfigService } from '@nestjs/config'

import { EnvService } from './env.service'

describe('EnvService', () => {
  let moduleRef: TestingModule
  let envService: EnvService
  let configService: ConfigService

  beforeEach(async () => {
    moduleRef = await Test.createTestingModule({
      providers: [
        EnvService,
        {
          provide: ConfigService,
          useValue: {
            get: vi.fn(),
          },
        },
      ],
    }).compile()

    envService = moduleRef.get(EnvService)
    configService = moduleRef.get(ConfigService)
  })

  afterEach(() => {
    moduleRef.close()
  })

  test('should be defined', () => {
    expect(envService).toBeDefined()
  })

  describe('get', () => {
    test('should return the value from the config service', () => {
      const PORT = 4000

      const getConfigSpy = vi.spyOn(configService, 'get').mockReturnValue(PORT)

      expect(envService.get('PORT')).toEqual(PORT)

      expect(getConfigSpy).toHaveBeenCalledWith('PORT')
    })
  })
})
