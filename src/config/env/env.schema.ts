import { z } from 'zod'

export const envSchema = z.object({
  PORT: z.coerce.number().optional().default(4000),
  SPOTIFY_CLIENT_ID: z.coerce.string(),
  SPOTIFY_CLIENT_SECRET: z.coerce.string(),
  SPOTIFY_BASE_URL: z.coerce.string(),
  SPOTIFY_ACCOUNTS_URL: z.coerce.string(),
  HISTORY_SYNCHRONIZATION_CRONTIME: z.coerce.string().default('0 */1 * * *'),
  ENABLE_HISTORY_SYNCHRONIZATION: z.coerce.boolean().default(true),
  DATABASE_HOST: z.coerce.string(),
  DATABASE_PORT: z.coerce.number().optional().default(5432),
  DATABASE_USERNAME: z.coerce.string(),
  DATABASE_PASSWORD: z.coerce.string(),
  DATABASE_NAME: z.coerce.string(),
  REDIS_HOST: z.coerce.string(),
  REDIS_PORT: z.coerce.number(),
  REDIS_USER: z.coerce.string().nullable(),
  REDIS_PASSWORD: z.coerce.string().nullable(),
  PUBLIC_USER_ID: z.coerce.string().optional(),
})

export type Env = z.infer<typeof envSchema>
