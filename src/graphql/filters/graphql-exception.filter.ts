import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { GqlContextType } from '@nestjs/graphql';
import { GraphQLError } from 'graphql';

import { EntityNotFoundError } from 'typeorm/error/EntityNotFoundError';
import {
  EntityNotFoundGraphQLError,
  QueryFailedGraphQLError,
} from '../exceptions/http.exceptions';
import { QueryFailedError } from 'typeorm';

@Catch()
export class GraphQLGenericExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost): void {
    const ctxType = host.getType<GqlContextType>();

    if (ctxType === 'graphql') {
      if (exception instanceof EntityNotFoundError) {
        throw new EntityNotFoundGraphQLError(exception);
      }
      if (exception instanceof QueryFailedError) {
        throw new QueryFailedGraphQLError(exception);
      }

      // If there's a specific statusCode or status property in the exception, use it. Otherwise, default to 500.
      const statusCode = exception.statusCode || exception.status || 500;
      const extensions = {
        code: `HTTP_${statusCode}`,
        status: statusCode,
      };

      throw new GraphQLError(exception.message, {
        extensions,
      });
    } else {
      // Non-GraphQL context. Handle or throw for another filter to catch.
    }
  }
}
