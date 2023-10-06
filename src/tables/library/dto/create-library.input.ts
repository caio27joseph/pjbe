import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateLibraryInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
