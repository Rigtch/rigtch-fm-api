import { OmitType } from '@nestjs/swagger'

import { Album } from '../album.entity'

export class AlbumBaseDocument extends OmitType(Album, ['tracks', 'artists']) {}
