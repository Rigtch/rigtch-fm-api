import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { RmqOptions } from '@nestjs/microservices'
import { ValidationPipe } from '@nestjs/common'

import { StatisticsModule } from './statistics.module'
import { Environment } from './config'

import { RmqService, Service } from '@lib/common'

const app = await NestFactory.create(StatisticsModule)
const configService = app.get(ConfigService)
const rmqService = app.get(RmqService)

app.enableCors()
app.useGlobalPipes(new ValidationPipe())
app.connectMicroservice<RmqOptions>(
  rmqService.getOptions(Service.STATISTICS, true)
)

await app.startAllMicroservices()
await app.listen(+configService.get(Environment.PORT) || 4000)
