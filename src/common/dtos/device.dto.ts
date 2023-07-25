import { ApiProperty } from '@nestjs/swagger'

import { FormattedDevice } from '~/common/types/spotify'

export abstract class Device implements FormattedDevice {
  @ApiProperty()
  id: string

  @ApiProperty()
  name: string

  @ApiProperty()
  type: string

  @ApiProperty({ type: Boolean })
  isActive: boolean

  @ApiProperty({ type: Boolean })
  isPrivateSession: boolean

  @ApiProperty({ type: Boolean })
  isRestricted: boolean

  @ApiProperty({ type: Number })
  volumePercent: number
}
