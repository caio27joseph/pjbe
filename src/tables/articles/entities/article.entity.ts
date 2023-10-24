import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Library } from 'src/tables/library/entities/library.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Article {
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Field()
  @Column()
  name: string;

  @Column({
    nullable: true,
  })
  @Field({ nullable: true })
  parentId: string;

  @ManyToOne(() => Library, (library) => library.articles)
  @Field(() => Library)
  @JoinColumn()
  library: Library;

  @Column()
  @Field(() => ID)
  libraryId: string;
}
