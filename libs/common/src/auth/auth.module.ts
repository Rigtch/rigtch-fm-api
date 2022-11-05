import { Module } from '@nestjs/common'

import { RmqModule, Services } from '..'

@Module({
  imports: [RmqModule.register({ name: Services.AUTH })],
  exports: [RmqModule],
})
export class AuthModule {}
