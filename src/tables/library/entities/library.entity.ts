import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Table } from 'src/tables/table/entities/table.entity';
import {
  Column,
  Entity,
  EntityNotFoundError,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
@ObjectType()
export class Directory {
  @Field() id: string;

  @Field() name: string;

  @Field({ nullable: true }) parentId?: string;
}

@ObjectType()
@Entity()
export class Library {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Field({
    nullable: true,
  })
  @Column({
    nullable: true,
    length: 40,
  })
  icon?: string;

  @Field()
  @Column({
    length: 16,
  })
  name: string;

  @Field(() => Table)
  @ManyToOne(() => Table, (table) => table.libraries, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  table: Table;

  @Column()
  tableId: string;

  @Field(() => [Directory])
  @Column({
    type: 'json',
    default: [],
  })
  root: Directory[];

  addDirectory({ parentId, name }: { parentId?: string; name: string }) {
    if (parentId) {
      const parent = this.root.find((di) => di.id === parentId);
      if (!parent) throw new EntityNotFoundError('Directory', parentId);
    }
    const id = uuidv4();
    const directory = { id, name, parentId };
    this.root.push(directory);
  }
}
