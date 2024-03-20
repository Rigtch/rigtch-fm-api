import { ApiProperty } from '@nestjs/swagger'

export abstract class Success {
  @ApiProperty({ type: Boolean })
  readonly success: boolean

  @ApiProperty({ required: false })
  readonly message?: string
}
