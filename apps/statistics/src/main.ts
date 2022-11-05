import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'

import { StatisticsModule } from './statistics.module'
import { Environment } from './config'

const app = await NestFactory.create(StatisticsModule)
const configService = app.get(ConfigService)

app.enableCors()

await app.startAllMicroservices()
await app.listen(+configService.get(Environment.PORT) || 4000)
