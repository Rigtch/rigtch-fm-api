import { ObjectType, Resolver, Query, Field } from '@nestjs/graphql'
import { firstValueFrom } from 'rxjs'

import { AuthService } from './auth.service'
import { ProfileDto, TokenResponse } from './dtos'

import { AccessToken, RefreshToken } from '@lib/common'

@ObjectType()
export abstract class Hello {
  @Field()
  hello: string
}

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query(() => Hello, { name: 'hello' })
  getHello() {
    return {
      hello: this.authService.getHello(),
    }
  }

  @Query(() => TokenResponse)
  async refresh(@RefreshToken() refreshToken: string) {
    return await firstValueFrom(this.authService.token({ refreshToken }))
  }

  @Query(() => ProfileDto)
  async profile(@AccessToken() accessToken: string) {
    return await firstValueFrom(this.authService.profile(accessToken))
  }
}
