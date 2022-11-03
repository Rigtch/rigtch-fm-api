import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import passport from 'passport'

import { AuthModule } from './auth.module'
import { Environment } from './config'

const app = await NestFactory.create(AuthModule)
const configService = app.get(ConfigService)

app.enableCors()
app.use(passport.initialize())
await app.listen(+configService.get(Environment.PORT) || 4000)
