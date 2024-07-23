import { NestFactory, Reflector } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import cookieParser from 'cookie-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'

import { Environment } from '@config/environment'
import { AppModule } from '@modules/app'
import { BEARER } from '@common/constants'
import { QueryExceptionFilter } from '@common/filters'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const reflector = app.get(Reflector)
  const configService = app.get(ConfigService)

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

  await app.listen(+configService.get(Environment.PORT) || 4000)
}
bootstrap()
