import { User } from 'src/users/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';

// user.entity.ts
@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToOne(() => User, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  user: User;

  @Column()
  userId: string;
}
