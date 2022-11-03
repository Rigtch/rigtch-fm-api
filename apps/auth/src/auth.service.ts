import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Profile } from 'passport-spotify'

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  login({ id, username }: Profile) {
    const payload = {
      name: username,
      sub: id,
    }

    return this.jwtService.sign(payload)
  }

  getHello() {
    return 'Hello World!'
  }
}
