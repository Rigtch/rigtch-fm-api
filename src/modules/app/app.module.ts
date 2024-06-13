import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm'
import { BullModule } from '@nestjs/bull'
import { BullBoardModule } from '@bull-board/nestjs'
import { ExpressAdapter } from '@bull-board/express'
import { CacheModule } from '@nestjs/cache-manager'
import { redisStore } from 'cache-manager-ioredis-yet'

import { environmentSchema } from '@config/environment'
import { redis, typeorm } from '@config/database'
import { ImagesModule } from '@modules/items/images'
import { ProfilesModule } from '@modules/profiles'
import { UsersModule } from '@modules/users'
import { AdaptersModule } from '@common/adapters'
import { ArtistsModule } from '@modules/items/artists'
import { AlbumsModule } from '@modules/items/albums'
import { TracksModule } from '@modules/items/tracks'
import { HistoryModule } from '@modules/history'
import { ArtistsRouterModule } from '@modules/items/artists/router'

@Module({
  imports: [
    AdaptersModule,
    ImagesModule,
    ProfilesModule,
    UsersModule,
    ArtistsModule,
    ArtistsRouterModule,
    AlbumsModule,
    TracksModule,
    HistoryModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
      validationSchema: environmentSchema,
      load: [typeorm, redis],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) =>
        configService.get<TypeOrmModuleOptions>('typeorm')!,
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        redis: configService.get('redis'),
        settings: {
          maxStalledCount: 1,
        },
      }),
      imports: [ConfigModule],
      inject: [ConfigService],
    }),
    BullBoardModule.forRoot({
      route: '/queues',
      adapter: ExpressAdapter,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async (configService: ConfigService) => ({
        store: await redisStore({
          ...configService.get('redis'),
          db: 1,
        }),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
