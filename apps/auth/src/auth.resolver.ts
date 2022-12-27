import { Resolver, Query } from '@nestjs/graphql'
import { firstValueFrom } from 'rxjs'
import { ConfigService } from '@nestjs/config'

import { AuthService } from './auth.service'
import { ProfileDto, SecretData } from './dtos'

import { AccessToken, RefreshToken } from '@lib/common'

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  @Query(() => SecretData)
  async refresh(@RefreshToken() refreshToken: string) {
    return await firstValueFrom(this.authService.token({ refreshToken }))
  }

  @Query(() => ProfileDto)
  async profile(@AccessToken() accessToken: string) {
    return await firstValueFrom(this.authService.profile(accessToken))
  }
}
