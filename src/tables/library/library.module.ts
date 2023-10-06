import { Module } from '@nestjs/common';
import { LibraryService } from './library.service';
import { LibraryResolver } from './library.resolver';

@Module({
  providers: [LibraryResolver, LibraryService],
})
export class LibraryModule {}
