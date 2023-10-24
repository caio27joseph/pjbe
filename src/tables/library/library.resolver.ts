import {
  Resolver,
  Query,
  Mutation,
  Args,
  Int,
  Subscription,
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
import { PubSub } from 'graphql-subscriptions';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/gql-jwt.guard';
import { LibraryEvent } from './library.events';

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
  async createLibrary(@Args('input') input: CreateLibraryInput) {
    const entity = this.libraryRepo.create(input);
    const library = await this.libraryRepo.save(entity);
    this.pubSub.publish(
      LibraryEvent.EVENT,
      LibraryEvent.toPayload({
        created: library,
      }),
    );
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
    this.pubSub.publish(
      LibraryEvent.EVENT,
      LibraryEvent.toPayload({
        updated: library,
      }),
    );
    return library;
  }

  @Mutation(() => Library)
  async addDirectory(
    @Args('where') where: WhereInput,
    @Args('input') input: CreateDirectoryInput,
  ) {
    const library = await this.libraryRepo.findOneByOrFail(where);
    library.addDirectory(input);
    this.pubSub.publish(
      LibraryEvent.EVENT,
      LibraryEvent.toPayload({
        updated: library,
      }),
    );
    console.log(library);
    return this.libraryRepo.save(library);
  }

  @Subscription((returns) => LibraryEvent, {
    name: LibraryEvent.EVENT,
  })
  events() {
    return this.pubSub.asyncIterator(LibraryEvent.EVENT);
  }

  @Mutation(() => Library)
  async removeLibrary(@Args('where') where: WhereInput) {
    const library = await this.libraryRepo.findOneByOrFail(where);
    this.pubSub.publish(
      LibraryEvent.EVENT,
      LibraryEvent.toPayload({
        removed: library,
      }),
    );
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
