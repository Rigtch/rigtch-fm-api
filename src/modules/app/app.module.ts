import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { redisStore } from 'cache-manager-ioredis-yet'

import { AdaptersModule } from '@common/adapters'
import { DatabaseModule, redis, typeorm } from '@config/database'
import { EnvModule, envSchema } from '@config/env'
import { HistoryModule } from '@modules/history'
import { HistoryRouterModule } from '@modules/history/router'
import { AlbumsModule } from '@modules/items/albums'
import { ArtistsModule } from '@modules/items/artists'
import { ArtistsRouterModule } from '@modules/items/artists/router'
import { ImagesModule } from '@modules/items/images'
import { TracksModule } from '@modules/items/tracks'
import { ProfilesModule } from '@modules/profiles'
import { ReportsRouterModule } from '@modules/reports/router'
import { StatsRouterModule } from '@modules/stats/router'
import { UsersModule } from '@modules/users'
import { QueuesModule } from '@config/queues'

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
    HistoryRouterModule,
    StatsRouterModule,
    ReportsRouterModule,
    EnvModule,
    DatabaseModule,
    QueuesModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env',
      validate: config => envSchema.parse(config),
      load: [typeorm, redis],
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
