import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { RmqOptions } from '@nestjs/microservices'

import { PlayerModule } from './player.module'
import { Environment } from './config'

import { RmqService, Service } from '@lib/common'

const app = await NestFactory.create(PlayerModule)
const configService = app.get(ConfigService)
const rmqService = app.get(RmqService)

app.connectMicroservice<RmqOptions>(rmqService.getOptions(Service.PLAYER, true))

await app.startAllMicroservices()
await app.listen(+configService.get(Environment.SPOTIFY_BASE_URL) || 4002)
