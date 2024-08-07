import Joi from 'joi'

export const environmentSchema = Joi.object({
  PORT: Joi.number().default(4000),
  SPOTIFY_CLIENT_ID: Joi.string().required(),
  SPOTIFY_CLIENT_SECRET: Joi.string().required(),
  SPOTIFY_BASE_URL: Joi.string().required(),
  SPOTIFY_ACCOUNTS_URL: Joi.string().required(),
  HISTORY_SYNCHRONIZATION_CRONTIME: Joi.string().default('0 */1 * * *'),
  ENABLE_HISTORY_SYNCHRONIZATION: Joi.boolean().default(true),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  REDIS_USER: Joi.string().allow(null, ''),
  REDIS_PASSWORD: Joi.string().allow(null, ''),
})
