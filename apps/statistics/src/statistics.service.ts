import { Injectable } from '@nestjs/common'

@Injectable()
export class StatisticsService {
  getHello(): string {
    return 'Hello World!'
  }
}
