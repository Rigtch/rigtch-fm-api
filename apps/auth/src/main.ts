import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'

import { AuthModule } from './auth.module'
import { Environment } from './config'

const app = await NestFactory.create(AuthModule)
const configService = app.get(ConfigService)

await app.startAllMicroservices()
await app.listen(+configService.get(Environment.PORT) || 4001)
