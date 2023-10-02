import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ID,
  ResolveField,
} from '@nestjs/graphql';
import { TableService } from './table.service';
import { Table } from './entities/table.entity';
import { CreateTableInput } from './dto/create-table.input';
import { UpdateTableInput } from './dto/update-table.input';
import { UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/user/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GqlAuthGuard } from 'src/auth/guards/gql-jwt.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Resolver('table')
export class TableResolver {
  constructor(
    @InjectRepository(Table)
    private readonly repo: Repository<Table>,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Table)
  createTable(
    @CurrentUser() user: User,
    @Args('where') where: CreateTableInput,
  ) {
    const table = this.repo.create({
      ...where,
      owner: user,
    });
    return this.repo.save(table);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => [Table])
  myTables(@CurrentUser() user: User) {
    return this.repo.findBy({
      owner: {
        id: user.id,
      },
    });
  }

  // @Mutation(() => Table)
  // updateTable(@Args('updateTableInput') updateTableInput: UpdateTableInput) {
  //   return this.tableService.update(updateTableInput.id, updateTableInput);
  // }

  // @Mutation(() => Table)
  // removeTable(@Args('id', { type: () => Int }) id: number) {
  //   return this.tableService.remove(id);
  // }
}
