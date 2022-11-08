import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import { request, spec } from 'pactum'

import { StatisticsEnvironment, StatisticsModule } from '@app/statistics'

describe('StatisticsController (e2e)', () => {
  let app: INestApplication
  let url: string

  process.env[StatisticsEnvironment.SPOTIFY_BASE_URL] = 'test'

  beforeEach(async () => {
    // jest.resetModules()

    process.env.SPOTIFY_BASE_URL = 'test'

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [StatisticsModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.listen(0)

    url = await app.getUrl()

    request.setBaseUrl(url.replace('[::1]', 'localhost'))
  })

  afterAll(async () => {
    await app.close()
  })

  it('/ (GET)', () => {
    return spec().get('/').expectStatus(200).expectBody('Hello World!')
  })
})
