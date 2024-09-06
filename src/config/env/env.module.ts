import { Global, Module } from '@nestjs/common'

import { EnvService as EnvironmentService } from './env.service'

@Global()
@Module({
  providers: [EnvironmentService],
  exports: [EnvironmentService],
})
export class EnvModule {}
