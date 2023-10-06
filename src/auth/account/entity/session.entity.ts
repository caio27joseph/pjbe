import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
  Index,
} from 'typeorm';
import { Account } from './account.entity';

@Entity()
export class Session {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Account, (account) => account.sessions, {
    eager: true,
  })
  @JoinColumn()
  account: Account;

  @Column()
  accountId: number;

  @Column()
  @Index()
  refreshToken: string;

  @Column('timestamp with time zone')
  refreshTokenExp: Date;

  @Column({ nullable: true })
  deviceInfo: string; // e.g., "Mobile App on Android", "Web Browser on Windows"

  // ... any other fields you might want, like IP address, user agent, etc.
}
