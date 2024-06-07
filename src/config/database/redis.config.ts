import { ConfigService, registerAs } from '@nestjs/config'
import type { RedisOptions } from 'ioredis'

import { Environment } from '@config/environment'

const configService = new ConfigService()

const { REDIS_HOST, REDIS_PORT, REDIS_USER, REDIS_PASSWORD } = Environment

export const redisConfig: RedisOptions = {
  host: configService.get(REDIS_HOST),
  port: configService.get(REDIS_PORT),
  username: configService.get(REDIS_USER),
  password: configService.get(REDIS_PASSWORD),
}

export const redis = registerAs('redis', () => redisConfig)
