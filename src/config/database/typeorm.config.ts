import 'dotenv/config'

import { ConfigService, registerAs } from '@nestjs/config'
import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { DataSource, DataSourceOptions } from 'typeorm'

import { EnvService } from '@config/env'
import { migrations } from '@migrations/all'
import { HistoryTrack } from '@modules/history/tracks'
import { Album } from '@modules/items/albums'
import { Artist } from '@modules/items/artists'
import { Image } from '@modules/items/images'
import { Track } from '@modules/items/tracks'
import { Profile } from '@modules/profiles'
import { User } from '@modules/users'

const envService = new EnvService(new ConfigService())

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: envService.get('DATABASE_HOST'),
  port: envService.get('DATABASE_PORT'),
  username: envService.get('DATABASE_USERNAME'),
  password: envService.get('DATABASE_PASSWORD'),
  database: envService.get('DATABASE_NAME'),
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
