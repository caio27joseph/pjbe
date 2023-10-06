import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GraphQLGenericExceptionFilter } from './graphql/filters/graphql-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GraphQLGenericExceptionFilter(httpAdapter));

  app.enableCors();
  await app.listen(3000);
  // cors
}
bootstrap();
