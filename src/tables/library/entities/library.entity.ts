import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class Library {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
