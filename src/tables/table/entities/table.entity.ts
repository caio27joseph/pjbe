import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { User } from 'src/users/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@ObjectType()
@Entity()
export class Table {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({
    length: 100,
  })
  title: string;
  @Field({
    nullable: true,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  imageUrl: string;
  @Field({
    nullable: true,
  })
  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @ManyToOne(() => User, (user) => user.myTables)
  @JoinColumn()
  owner: User;

  @Field(() => ID)
  @Column()
  ownerId: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
