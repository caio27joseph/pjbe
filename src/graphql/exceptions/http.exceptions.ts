import { BadRequestException } from '@nestjs/common';
import { GraphQLError } from 'graphql';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

export class EntityNotFoundGraphQLError extends GraphQLError {
  constructor(exception: EntityNotFoundError) {
    super(exception.message, {
      extensions: {
        message: exception.message,
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

export class ValidationGraphQLError extends GraphQLError {
  constructor(exception: BadRequestException) {
    const response = exception.getResponse() as any;
    super(exception.message, {
      extensions: {
        code: response.error,
        status: response.statusCode,
        errors: response.message,
      },
      originalError: exception,
    });
  }
}
