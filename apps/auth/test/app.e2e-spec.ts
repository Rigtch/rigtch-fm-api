import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as pactum from 'pactum'

import { AuthModule } from './../src/auth.module'

const HELLO_QUERY_NAME = 'hello'
const HELLO_QUERY = `
  query hello {
    hello {
      hello
    }
  }
`

describe('AuthResolver (e2e)', () => {
  let app: INestApplication
  let url: string

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.listen(0)

    url = await app.getUrl()

    pactum.request.setBaseUrl(url.replace('[::1]', 'localhost'))
  })

  afterAll(async () => {
    await app.close()
  })

  it('hello (QUERY)', () => {
    return pactum
      .spec()
      .post('/graphql')
      .withJson({
        operationName: HELLO_QUERY_NAME,
        query: HELLO_QUERY,
      })
      .expectStatus(200)
      .expectBody({
        data: {
          hello: {
            hello: 'Hello World!',
          },
        },
      })
  })
})
