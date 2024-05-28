import Joi from 'joi'

export const environmentSchema = Joi.object({
  PORT: Joi.number().default(4000),
  SPOTIFY_CLIENT_ID: Joi.string().required(),
  SPOTIFY_CLIENT_SECRET: Joi.string().required(),
  SPOTIFY_CALLBACK_URL: Joi.string().required(),
  SPOTIFY_BASE_URL: Joi.string().required(),
  SPOTIFY_ACCOUNTS_URL: Joi.string().required(),
  CLIENT_CALLBACK_URL: Joi.string().required(),
  HISTORY_FETCHING_INTERVAL: Joi.string().default('1h'),
  HISTORY_FETCHING_DELAY: Joi.string().default('2m'),
  DATABASE_HOST: Joi.string().required(),
  DATABASE_PORT: Joi.number().required(),
  DATABASE_USERNAME: Joi.string().required(),
  DATABASE_PASSWORD: Joi.string().required(),
  DATABASE_NAME: Joi.string().required(),
  ENABLE_TRACKS_VALIDATOR: Joi.boolean().default(false),
})
