import 'dotenv/config'

import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ConfigService, registerAs } from '@nestjs/config'
import { DataSource, DataSourceOptions } from 'typeorm'

import { Environment } from '@config/environment'
import { migrations } from '@migrations/all'
import { User } from '@modules/users'
import { Profile } from '@modules/profiles'
import { Album } from '@modules/items/albums'
import { Artist } from '@modules/items/artists'
import { Track } from '@modules/items/tracks'
import { Image } from '@modules/items/images'
import { HistoryTrack } from '@modules/history/tracks'

const configService = new ConfigService()

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: configService.get(Environment.DATABASE_HOST),
  port: configService.get(Environment.DATABASE_PORT),
  username: configService.get(Environment.DATABASE_USERNAME),
  password: configService.get(Environment.DATABASE_PASSWORD),
  database: configService.get(Environment.DATABASE_NAME),
  entities: [User, Profile, Album, Artist, Track, Image, HistoryTrack],
  migrations,
  migrationsRun: true,
  autoLoadEntities: true,
  synchronize: false,
}

export const typeorm = registerAs('typeorm', () => typeOrmConfig)
export const connectionSource = new DataSource(
  typeOrmConfig as DataSourceOptions
)
