import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  ResolveField,
} from '@nestjs/graphql';

import { Library } from './entities/library.entity';

import { Repository } from 'typeorm';
import {
  CreateDirectoryInput,
  CreateLibraryInput,
  FindTableLibrariesInput,
  UpdateLibraryInput,
} from './library.inputs';
import { WhereInput } from 'src/graphql/dto/WhereOne.input';
import { InjectRepository } from '@nestjs/typeorm';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-jwt.guard';

@UseGuards(GqlAuthGuard)
@Resolver(() => Library)
export class LibraryResolver {
  constructor(
    @InjectRepository(Library)
    private readonly libraryRepo: Repository<Library>,
  ) {
  }

  @Mutation(() => Library)
  async createLibrary(@Args('input') input: CreateLibraryInput) {
    const entity = this.libraryRepo.create(input);
    const library = await this.libraryRepo.save(entity);

    return library;
  }

  @Mutation(() => Library)
  async updateLibrary(
    @Args('where') where: WhereInput,
    @Args('input') input: UpdateLibraryInput,
  ) {
    let library = await this.libraryRepo.findOneByOrFail(where);
    library = await this.libraryRepo.save({
      ...library,
      ...input,
    });

    return library;
  }

  @Mutation(() => Library)
  async addDirectory(
    @Args('where') where: WhereInput,
    @Args('input') input: CreateDirectoryInput,
  ) {
    const library = await this.libraryRepo.findOneByOrFail(where);
    library.addDirectory(input);

    return this.libraryRepo.save(library);
  }

  @Mutation(() => Library)
  async removeLibrary(@Args('where') where: WhereInput) {
    const library = await this.libraryRepo.findOneByOrFail(where);
    const result = this.libraryRepo.delete({
      id: library.id,
    });
    return library;
  }

  @Query(() => [Library])
  async tableLibraries(@Args('where') where: FindTableLibrariesInput) {
    return this.libraryRepo.findBy(where);
  }

  @Query(() => Library)
  async findLibrary(@Args('where') where: WhereInput) {
    return this.libraryRepo.findOneByOrFail(where);
  }
}
