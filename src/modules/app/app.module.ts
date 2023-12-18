import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'

import { environmentSchema } from '@config/environment'
import { typeorm } from '@config/database'
import { AuthModule } from '@modules/auth'
import { StatisticsModule } from '@modules/statistics'
import { PlayerModule } from '@modules/player'
import { ImagesModule } from '@modules/images'
import { ProfilesModule } from '@modules/profiles'
import { UsersModule } from '@modules/users'

@Module({
  imports: [
    AuthModule,
    StatisticsModule,
    PlayerModule,
    ImagesModule,
    ProfilesModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
      validationSchema: environmentSchema,
      load: [typeorm],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        configService.get<TypeOrmModuleOptions>('typeorm')!,
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
