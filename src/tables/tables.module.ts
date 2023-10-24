import { Module } from '@nestjs/common';
import { TableModule } from './table/table.module';
import { LibraryModule } from './library/library.module';
import { ArticlesModule } from './articles/articles.module';

@Module({
  imports: [TableModule, LibraryModule, ArticlesModule]
})
export class TablesModule {}
