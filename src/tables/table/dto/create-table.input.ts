import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateTableInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
