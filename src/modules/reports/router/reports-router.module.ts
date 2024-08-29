import { Module } from '@nestjs/common'

import { ReportsModule } from '../reports.module'

import { ReportsController } from './reports.controller'

import { UsersModule } from '@modules/users'

@Module({
  imports: [ReportsModule, UsersModule],
  controllers: [ReportsController],
})
export class ReportsRouterModule {}
