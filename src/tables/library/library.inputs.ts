import { InputType, Int, Field, PartialType, ID } from '@nestjs/graphql';
import { IsOptional, IsString, IsUUID, Length } from 'class-validator';

@InputType()
export class CreateLibraryInput {
  @IsString()
  @IsOptional()
  @Length(1, 40)
  @Field({ nullable: true })
  icon?: string;

  @IsString()
  @Field()
  @Length(1, 16)
  name: string;

  @IsUUID()
  @Field()
  tableId: string;
}

@InputType()
export class UpdateLibraryInput extends PartialType(CreateLibraryInput) {}

@InputType()
export class FindLibraryInput {
  @IsUUID()
  @Field(() => ID)
  id: string;
}

@InputType()
export class FindTableLibrariesInput {
  @IsUUID()
  @Field(() => ID)
  tableId: string;
}

@InputType()
export class CreateDirectoryInput {
  @IsString()
  @Field()
  name: string;

  @IsUUID()
  @Field({
    nullable: true,
  })
  @IsOptional()
  parentId: string;
}
