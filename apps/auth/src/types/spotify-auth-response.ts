import { Request } from 'express'

import { SpotifyAuth } from '../dtos'

export type SpotifyAuthRequest = SpotifyAuth & Request
