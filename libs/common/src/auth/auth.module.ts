import { Module } from '@nestjs/common'

import { RmqModule } from '..'
import { Service } from '../services'

@Module({
  imports: [RmqModule.register({ name: Service.AUTH })],
  exports: [RmqModule],
})
export class AuthModule {}
