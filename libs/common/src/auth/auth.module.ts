import { Module } from '@nestjs/common'

import { RmqModule } from '..'
import { Service } from '../services.enum'

@Module({
  imports: [RmqModule.register({ name: Service.AUTH })],
  exports: [RmqModule],
})
export class AuthModule {}
