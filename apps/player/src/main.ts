import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import cookieParser from 'cookie-parser'

import { PlayerModule } from './player.module'
import { Environment } from './config'

const app = await NestFactory.create(PlayerModule)
const configService = app.get(ConfigService)

app.enableCors({
  origin: ['*', 'https://rigtch-music.vercel.app'],
  credentials: true,
})
app.use(cookieParser())

await app.startAllMicroservices()
await app.listen(+configService.get(Environment.PORT) || 4002)
