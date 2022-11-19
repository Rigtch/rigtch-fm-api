import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'

import { PlayerModule } from './player.module'
import { Environment } from './config'

const app = await NestFactory.create(PlayerModule)
const configService = app.get(ConfigService)

await app.startAllMicroservices()
await app.listen(+configService.get(Environment.PORT) || 4002)
