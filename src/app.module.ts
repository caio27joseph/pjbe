import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { TablesModule } from './tables/tables.module';

@Module({
  imports: [DatabaseModule, AuthModule, TablesModule],
  providers: [],
})
export class AppModule {}
