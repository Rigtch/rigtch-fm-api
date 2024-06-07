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

const {
  DATABASE_HOST,
  DATABASE_PORT,
  DATABASE_USERNAME,
  DATABASE_PASSWORD,
  DATABASE_NAME,
} = Environment

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: configService.get(DATABASE_HOST),
  port: configService.get(DATABASE_PORT),
  username: configService.get(DATABASE_USERNAME),
  password: configService.get(DATABASE_PASSWORD),
  database: configService.get(DATABASE_NAME),
  entities: [User, Profile, Album, Artist, Track, Image, HistoryTrack],
  migrations,
  migrationsRun: true,
  autoLoadEntities: true,
  synchronize: false,
  cache: {
    type: 'ioredis',
    options: configService.get('redis'),
  },
}

export const typeorm = registerAs('typeorm', () => typeOrmConfig)
export const connectionSource = new DataSource(
  typeOrmConfig as DataSourceOptions
)
