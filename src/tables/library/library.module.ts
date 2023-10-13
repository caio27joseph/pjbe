import { Module } from '@nestjs/common';
import { LibraryResolver } from './library.resolver';
import { Library } from './entities/library.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Library])],
  providers: [LibraryResolver],
})
export class LibraryModule {}
