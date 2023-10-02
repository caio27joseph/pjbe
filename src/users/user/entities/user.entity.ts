import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Table } from 'src/tables/table/entities/table.entity';
import { Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType()
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @OneToMany(() => Table, (table) => table.owner)
  @Field(() => [Table])
  myTables: Table[];
}
