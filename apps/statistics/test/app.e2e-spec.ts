import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as pactum from 'pactum'

import { StatisticsModule } from './../src/statistics.module'

describe('StatisticsController (e2e)', () => {
  let app: INestApplication
  let url: string

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [StatisticsModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.listen(0)

    url = await app.getUrl()

    pactum.request.setBaseUrl(url.replace('[::1]', 'localhost'))
  })

  afterAll(async () => {
    await app.close()
  })

  it('/ (GET)', () => {
    return pactum.spec().get('/').expectStatus(200).expectBody('Hello World!')
  })
})
