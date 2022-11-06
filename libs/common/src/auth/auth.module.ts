import { Module } from '@nestjs/common'

import { RmqModule } from '..'
import { Services } from '../services'

@Module({
  imports: [RmqModule.register({ name: Services.AUTH })],
  exports: [RmqModule],
})
export class AuthModule {}
