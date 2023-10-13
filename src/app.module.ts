import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { TablesModule } from './tables/tables.module';
import { UsersModule } from './users/users.module';
import { GraphQlModule } from './graphql/graphql.module';

@Module({
  imports: [
    DatabaseModule,
    GraphQlModule,
    AuthModule,
    TablesModule,
    UsersModule,
  ],
  providers: [],
  exports: [],
})
export class AppModule {}
