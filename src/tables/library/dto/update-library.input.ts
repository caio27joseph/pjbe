import { CreateLibraryInput } from './create-library.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateLibraryInput extends PartialType(CreateLibraryInput) {
  @Field(() => Int)
  id: number;
}
