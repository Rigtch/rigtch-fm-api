import 'dotenv/config'

import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ConfigService, registerAs } from '@nestjs/config'
import { DataSource, DataSourceOptions } from 'typeorm'

import { Environment } from '@config/environment'
import { User } from '@modules/users'
import { Profile } from '@modules/profiles'
import { Album } from '@modules/albums'
import { Artist } from '@modules/artists'
import { Track } from '@modules/tracks'
import { History } from '@modules/history'
import { Image } from '@modules/images'
import { HistoryTrack } from '@modules/history/tracks'

const configService = new ConfigService()

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: configService.get(Environment.DATABASE_HOST),
  port: configService.get(Environment.DATABASE_PORT),
  username: configService.get(Environment.DATABASE_USERNAME),
  password: configService.get(Environment.DATABASE_PASSWORD),
  database: configService.get(Environment.DATABASE_NAME),
  entities: [User, Profile, Album, Artist, Track, Image, History, HistoryTrack],
  migrations: ['dist/migrations/*{.ts,.js}'],
  migrationsRun: true,
  autoLoadEntities: true,
  synchronize: false,
}

export const typeorm = registerAs('typeorm', () => typeOrmConfig)
export const connectionSource = new DataSource(
  typeOrmConfig as DataSourceOptions
)
