import { GraphQLError } from 'graphql';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

export class EntityNotFoundGraphQLError extends GraphQLError {
  constructor(exception: EntityNotFoundError) {
    super(exception.message, {
      extensions: {
        code: 'ENTITY_NOT_FOUND',
        status: 404,
      },
      originalError: exception,
    });
  }
}

export class QueryFailedGraphQLError extends GraphQLError {
  constructor(exception: QueryFailedError) {
    super(exception.message, {
      extensions: {
        code: 'QUERY_FAILED',
        status: 500,
      },
      originalError: exception,
    });
  }
}
