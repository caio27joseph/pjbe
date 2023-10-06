import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { LibraryService } from './library.service';
import { Library } from './entities/library.entity';
import { CreateLibraryInput } from './dto/create-library.input';
import { UpdateLibraryInput } from './dto/update-library.input';

@Resolver(() => Library)
export class LibraryResolver {
  constructor(private readonly libraryService: LibraryService) {}

  @Mutation(() => Library)
  createLibrary(
    @Args('createLibraryInput') createLibraryInput: CreateLibraryInput,
  ) {
    return this.libraryService.create(createLibraryInput);
  }

  @Query(() => [Library], { name: 'library' })
  findAll() {
    return this.libraryService.findAll();
  }

  @Query(() => Library, { name: 'library' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.libraryService.findOne(id);
  }

  @Mutation(() => Library)
  updateLibrary(
    @Args('updateLibraryInput') updateLibraryInput: UpdateLibraryInput,
  ) {
    return this.libraryService.update(
      updateLibraryInput.id,
      updateLibraryInput,
    );
  }

  @Mutation(() => Library)
  removeLibrary(@Args('id', { type: () => Int }) id: number) {
    return this.libraryService.remove(id);
  }
}
