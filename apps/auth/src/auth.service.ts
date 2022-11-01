import { Injectable } from '@nestjs/common'

@Injectable()
export class AuthService {
  getHello() {
    return 'Hello World!'
  }
}
