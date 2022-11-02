import { ObjectType, Resolver, Query, Field } from '@nestjs/graphql'

import { AuthService } from './auth.service'

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
}
