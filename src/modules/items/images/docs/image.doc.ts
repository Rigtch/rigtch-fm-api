import { OmitType } from '@nestjs/swagger'

import { Image } from '../image.entity'

export abstract class ImageDocument extends OmitType(Image, ['id']) {}
