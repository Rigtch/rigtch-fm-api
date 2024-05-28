import { OmitType } from '@nestjs/swagger'

import { Track } from '../track.entity'

export class TrackBaseDocument extends OmitType(Track, [
  'album',
  'artists',
  'historyTracks',
]) {}
