import { Module } from '@nestjs/common';
import { TableModule } from './table/table.module';

@Module({
  imports: [TableModule]
})
export class TablesModule {}
