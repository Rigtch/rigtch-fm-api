import { ApiProperty } from '@nestjs/swagger'

export abstract class Success {
  @ApiProperty({ type: Boolean })
  success: boolean

  @ApiProperty({ required: false })
  message?: string
}
