import { InputType, Int, Field, ID } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';

@InputType()
export class CreateTableInput {
  @Field({
    nullable: true,
  })
  @Length(3, 100)
  title: string;

  @Field({
    nullable: true,
  })
  @MaxLength(1000)
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @Field({
    nullable: true,
  })
  @Length(3, 2000)
  @IsNotEmpty()
  @IsOptional()
  description?: string;
}
