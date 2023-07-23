import { ConfigService } from '@nestjs/config'
import { Query, Resolver } from '@nestjs/graphql'
import { firstValueFrom } from 'rxjs'

import { AuthService } from './auth.service'
import { SecretData, ProfileDto } from './dtos'
import { Token } from './decorators'

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @Query(() => SecretData)
  async refresh(@Token() refreshToken: string) {
    return await firstValueFrom(this.authService.token({ refreshToken }))
  }

  @Query(() => ProfileDto)
  async profile(@Token() accessToken: string) {
    return await firstValueFrom(this.authService.profile(accessToken))
  }
}
