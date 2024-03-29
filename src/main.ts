import { NestFactory, Reflector } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import cookieParser from 'cookie-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'

import { Environment } from '@config/environment'
import { AppModule } from '@modules/app'
import { BEARER } from '@modules/auth/constants'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const reflector = app.get(Reflector)
  const configService = app.get(ConfigService)

  const documentConfig = new DocumentBuilder()
    .setTitle('Rigtch Music API')
    .addBearerAuth(
      {
        type: 'http',
        scheme: BEARER,
        bearerFormat: 'JWT',
      },
      BEARER
    )
    .build()

  const document = SwaggerModule.createDocument(app, documentConfig)

  SwaggerModule.setup('api', app, document)

  app.enableCors({
    origin: configService.get(Environment.CLIENT_CALLBACK_URL),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  })
  app.use(cookieParser())
  app.useGlobalPipes(new ValidationPipe())
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector))

  await app.listen(+configService.get(Environment.PORT) || 4000)
}
bootstrap()
