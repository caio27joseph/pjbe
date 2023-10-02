import { InputType, Int, Field, ID } from '@nestjs/graphql';
import { IsUrl, MaxLength } from 'class-validator';

@InputType()
export class CreateTableInput {
  @Field()
  @MaxLength(100)
  title: string;

  @Field()
  @MaxLength(255)
  @IsUrl()
  imageUrl: string;

  @Field()
  @MaxLength(2000)
  description: string;
}
