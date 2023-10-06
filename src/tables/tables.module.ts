import { Module } from '@nestjs/common';
import { TableModule } from './table/table.module';
import { LibraryModule } from './library/library.module';

@Module({
  imports: [TableModule, LibraryModule]
})
export class TablesModule {}
