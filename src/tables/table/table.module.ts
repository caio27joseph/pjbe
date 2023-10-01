import { Module } from '@nestjs/common';
import { TableService } from './table.service';
import { TableResolver } from './table.resolver';

@Module({
  providers: [TableResolver, TableService],
})
export class TableModule {}
