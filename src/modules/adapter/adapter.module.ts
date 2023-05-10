import { Module } from '@nestjs/common'

import { AdapterService } from './adapter.service'

@Module({
  providers: [AdapterService],
  exports: [AdapterService],
})
export class AdapterModule {}
