import 'dotenv/config'

import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { ConfigService, registerAs } from '@nestjs/config'
import { DataSource, DataSourceOptions } from 'typeorm'

import { Environment } from '@config/environment'

const configService = new ConfigService()

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: configService.get(Environment.DATABASE_HOST),
  port: configService.get(Environment.DATABASE_PORT),
  username: configService.get(Environment.DATABASE_USERNAME),
  password: configService.get(Environment.DATABASE_PASSWORD),
  database: configService.get(Environment.DATABASE_NAME),
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  migrationsRun: true,
  autoLoadEntities: true,
  synchronize: false,
}

export const typeorm = registerAs('typeorm', () => typeOrmConfig)
export const connectionSource = new DataSource(
  typeOrmConfig as DataSourceOptions
)
