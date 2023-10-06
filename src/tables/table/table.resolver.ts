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
import {
  UseGuards,
  Request,
  NotFoundException,
  HttpException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/users/user/entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GqlAuthGuard } from 'src/auth/guards/gql-jwt.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
// entity-not-found-graphql.error.ts

import { GraphQLError } from 'graphql';
import { WhereInput } from 'src/graphql/dto/WhereOne.input';

@UseGuards(GqlAuthGuard)
@Resolver(() => Table)
export class TableResolver {
  constructor(
    @InjectRepository(Table)
    private readonly repo: Repository<Table>,
  ) {}

  @Query(() => [Table], {
    name: 'myTables',
  })
  findMyTables(@CurrentUser() user: User) {
    return this.repo.findBy({
      owner: {
        id: user.id,
      },
    });
  }

  @Query(() => Table, {
    name: 'findTable',
  })
  async findOne(@CurrentUser() user: User, @Args('where') where: WhereInput) {
    return await this.repo.findOneByOrFail(where);
  }

  @Mutation(() => Table)
  createTable(
    @CurrentUser() user: User,
    @Args('input') input: CreateTableInput,
  ) {
    const table = this.repo.create({
      ...input,
      owner: user,
    });
    return this.repo.save(table);
  }

  @Mutation(() => Table)
  async updateTable(
    @CurrentUser() user: User,
    @Args('where') where: WhereInput,
    @Args('input') input: UpdateTableInput,
  ) {
    const table = await this.repo.findOneByOrFail({
      ...where,
      ownerId: user.id,
    });
    const updatedTable = this.repo.merge(table, input);
    return this.repo.save(updatedTable);
  }

  @Mutation(() => Table)
  async removeTable(
    @CurrentUser() user: User,
    @Args('where') where: WhereInput,
  ) {
    const table = await this.repo.findOneByOrFail({
      ...where,
      ownerId: user.id,
    });
    const result = await this.repo.delete({
      id: table.id,
      ownerId: user.id,
    });
    return table;
  }
}
