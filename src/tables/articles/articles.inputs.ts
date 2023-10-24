import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class CreateArticleInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  parentId: string;

  @Field(() => ID)
  libraryId: string;
}

@InputType()
export class UpdateArticleInput extends PartialType(CreateArticleInput) {}

@InputType()
export class FindLibraryArticles {
  @Field(() => ID)
  libraryId: string;
}

@InputType()
export class FindTableArticles {
  @Field(() => ID)
  tableId: string;
}
