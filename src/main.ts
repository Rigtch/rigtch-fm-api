import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import cookieParser from 'cookie-parser'

import { AppModule } from './modules/app'
import { Environment } from './config'

const app = await NestFactory.create(AppModule)
const configService = app.get(ConfigService)

app.enableCors({
  origin: configService.get(Environment.CLIENT_CALLBACK_URL),
  credentials: true,
})
app.use(cookieParser())

await app.startAllMicroservices()
await app.listen(+configService.get(Environment.PORT) || 4000)
