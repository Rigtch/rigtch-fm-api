import { NestFactory, Reflector } from '@nestjs/core'
import cookieParser from 'cookie-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'

import { AppModule } from '@modules/app'
import { BEARER } from '@common/constants'
import { QueryExceptionFilter } from '@common/filters'
import { EnvService } from '@config/env'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const reflector = app.get(Reflector)
  const envService = app.get(EnvService)

  const documentConfig = new DocumentBuilder()
    .setTitle('rigtch.fm API')
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
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  })
  app.use(cookieParser())
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  )
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector))
  app.useGlobalFilters(new QueryExceptionFilter())

  await app.listen(+envService.get('PORT') || 4000)
}
bootstrap()
