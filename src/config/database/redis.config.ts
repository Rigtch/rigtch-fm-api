import { registerAs } from '@nestjs/config'
import type { RedisOptions } from 'ioredis'

export const redisConfig: RedisOptions = {
  host: 'localhost',
  port: 6379,
}

export const redis = registerAs('redis', () => redisConfig)
