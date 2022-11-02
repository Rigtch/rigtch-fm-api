import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'

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

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('hello (QUERY)', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        operationName: HELLO_QUERY_NAME,
        query: HELLO_QUERY,
      })
      .expect(200)
      .expect(
        ({
          body: {
            data: { hello },
          },
        }) => {
          expect(hello.hello).toEqual('Hello World!')
        }
      )
  })
})
