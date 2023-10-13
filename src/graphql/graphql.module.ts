import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module, UnauthorizedException } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { Context } from 'graphql-ws';
import { join } from 'path';
import { AppModule } from 'src/app.module';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      imports: [ConfigModule, AuthModule],
      driver: ApolloDriver,
      useFactory: async (authService: AuthService) => {
        return {
          autoSchemaFile: join(process.cwd(), 'src/generated/schema.gql'),
          subscriptions: {
            'subscriptions-transport-ws': {
              onConnect: async (context: any) => {
                const authorization = context?.authorization ?? '';
                const token = authorization.replace('Bearer ', '');

                if (!token) {
                  throw new UnauthorizedException('No auth token provided!');
                }

                const account = await authService.validateTokenForSubscription(
                  token,
                );
                if (!account) {
                  throw new UnauthorizedException(
                    'Invalid token or account not found!',
                  );
                }

                return { account };
              },
            },
          },
          includeStacktraceInErrorResponses:
            process.env.ENVIRONMENT !== 'production',
          installSubscriptionHandlers: true,
        };
      },
      //   autoSchemaFile: join(process.cwd(), 'src/generated/schema.gql'),

      //
      inject: [AuthService],
    }),
  ],
  providers: [],
  exports: [],
})
export class GraphQlModule {}
