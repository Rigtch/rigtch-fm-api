import { NestFactory } from '@nestjs/core'

import { AuthModule } from './auth.module'

const app = await NestFactory.create(AuthModule)

app.enableCors()
await app.listen(4000)
