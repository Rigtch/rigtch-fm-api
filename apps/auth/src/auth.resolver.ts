import { ObjectType, Resolver, Query, Field, Context } from '@nestjs/graphql'
import { firstValueFrom } from 'rxjs'
import { Response } from 'express'

import { AuthService } from './auth.service'
import { ProfileDto } from './dtos'

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

  @Query(() => Boolean)
  async refresh(
    @RefreshToken() refreshToken: string,
    @Context('req') { res: response }: { res: Response }
  ) {
    const { accessToken } = await firstValueFrom(
      this.authService.token({ refreshToken })
    )

    response.cookie('access-token', accessToken)

    if (accessToken) return true
  }

  @Query(() => Boolean)
  async logout(@Context('req') { res: response }: { res: Response }) {
    response.clearCookie('access-token')
    response.clearCookie('refresh-token')

    return true
  }

  @Query(() => ProfileDto)
  async profile(@AccessToken() accessToken: string) {
    return await firstValueFrom(this.authService.profile(accessToken))
  }
}
