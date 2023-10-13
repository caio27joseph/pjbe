import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Subscription,
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
import { PubSub } from 'graphql-subscriptions';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-jwt.guard';

@UseGuards(GqlAuthGuard)
@Resolver(() => Library)
export class LibraryResolver {
  private readonly pubSub: PubSub;
  constructor(
    @InjectRepository(Library)
    private readonly libraryRepo: Repository<Library>,
  ) {
    this.pubSub = new PubSub();
  }

  @Mutation(() => Library)
  createLibrary(@Args('input') input: CreateLibraryInput) {
    const library = this.libraryRepo.create(input);
    return this.libraryRepo.save(library);
  }

  @Mutation(() => Library)
  updateLibrary(
    @Args('where') where: WhereInput,
    @Args('input') input: UpdateLibraryInput,
  ) {
    const library = this.libraryRepo.findOneByOrFail(where);
    return this.libraryRepo.save({
      ...library,
      ...input,
    });
  }

  @Mutation(() => Library)
  async addDirectory(
    @Args('where') where: WhereInput,
    @Args('input') input: CreateDirectoryInput,
  ) {
    const library = await this.libraryRepo.findOneByOrFail(where);
    library.addDirectory(input);
    this.pubSub.publish('directoryAdded', { directoryAdded: library });
    return this.libraryRepo.save(library);
  }

  @Subscription((returns) => Library)
  directoryAdded() {
    return this.pubSub.asyncIterator('directoryAdded');
  }

  @Mutation(() => Library)
  async removeLibrary(@Args('where') where: WhereInput) {
    const library = await this.libraryRepo.findOneByOrFail(where);
    return this.libraryRepo.delete({
      id: library.id,
    });
  }

  @Query(() => [Library])
  async tableLibraries(@Args('where') where: FindTableLibrariesInput) {
    return this.libraryRepo.findBy(where);
  }

  @Query(() => Library)
  async library(@Args('where') where: WhereInput) {
    return this.libraryRepo.findOneByOrFail(where);
  }
}
