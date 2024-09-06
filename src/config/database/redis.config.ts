import { ConfigService, registerAs } from '@nestjs/config'
import type { RedisOptions } from 'ioredis'

import { EnvService } from '@config/env'

const envService = new EnvService(new ConfigService())

export const redisConfig: RedisOptions = {
  host: envService.get('REDIS_HOST'),
  port: envService.get('REDIS_PORT'),
  username: envService.get('REDIS_USER') ?? '',
  password: envService.get('REDIS_PASSWORD') ?? '',
}

export const redis = registerAs('redis', () => redisConfig)
