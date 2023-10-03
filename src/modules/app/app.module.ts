import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { environmentSchema } from '@config/environment'
import { AuthModule } from '@modules/auth'
import { StatisticsModule } from '@modules/statistics'
import { PlayerModule } from '@modules/player'
import { ImagesModule } from '@modules/images'
import { ProfilesModule } from '@modules/profiles'
import { typeorm } from '@config/database'

@Module({
  imports: [
    AuthModule,
    StatisticsModule,
    PlayerModule,
    ImagesModule,
    ProfilesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
      validationSchema: environmentSchema,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        configService.get('typeorm'),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
