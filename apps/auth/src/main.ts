import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { RmqOptions } from '@nestjs/microservices'

import { AuthModule } from './auth.module'
import { Environment } from './config'

import { RmqService, Service } from '@lib/common'

const app = await NestFactory.create(AuthModule)
const configService = app.get(ConfigService)
const rmqService = app.get(RmqService)

app.connectMicroservice<RmqOptions>(rmqService.getOptions(Service.AUTH, true))

await app.startAllMicroservices()
await app.listen(+configService.get(Environment.PORT) || 4001)
