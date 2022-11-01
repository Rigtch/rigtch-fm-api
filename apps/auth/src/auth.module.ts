import { Module } from '@nestjs/common'
import { GraphQLModule } from '@nestjs/graphql'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'

import { AuthService } from './auth.service'
import { AuthResolver } from './auth.resolver'

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: () => ({
        autoSchemaFile: true,
        playground: {
          settings: {
            'request.credentials': 'include',
          },
        },
        cors: {
          credentials: true,
          origin: true,
        },
      }),
    }),
  ],
  providers: [AuthService, AuthResolver],
})
export class AuthModule {}
