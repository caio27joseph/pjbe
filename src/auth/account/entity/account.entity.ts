import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// user.entity.ts
@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;
}
