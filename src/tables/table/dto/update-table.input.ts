import { CreateTableInput } from './create-table.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTableInput extends PartialType(CreateTableInput) {}
