import { User } from 'src/users/user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Session } from './session.entity';

// user.entity.ts
@Entity()
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({})
  password: string;

  @OneToOne(() => User, {
    eager: true,
    cascade: true,
  })
  @JoinColumn()
  user: User;

  @Column()
  @Index()
  userId: string;

  @OneToMany(() => Session, (session) => session.account)
  sessions: Session[];
}
