import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

// user.entity.ts
@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;
}
