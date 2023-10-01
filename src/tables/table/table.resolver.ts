import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TableService } from './table.service';
import { Table } from './entities/table.entity';
import { CreateTableInput } from './dto/create-table.input';
import { UpdateTableInput } from './dto/update-table.input';

@Resolver(() => Table)
export class TableResolver {
  constructor(private readonly tableService: TableService) {}

  @Mutation(() => Table)
  createTable(@Args('createTableInput') createTableInput: CreateTableInput) {
    return this.tableService.create(createTableInput);
  }

  @Query(() => [Table], { name: 'table' })
  findAll() {
    return this.tableService.findAll();
  }

  @Query(() => Table, { name: 'table' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.tableService.findOne(id);
  }

  @Mutation(() => Table)
  updateTable(@Args('updateTableInput') updateTableInput: UpdateTableInput) {
    return this.tableService.update(updateTableInput.id, updateTableInput);
  }

  @Mutation(() => Table)
  removeTable(@Args('id', { type: () => Int }) id: number) {
    return this.tableService.remove(id);
  }
}
