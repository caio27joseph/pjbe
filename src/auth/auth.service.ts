import {
  ConflictException,
  ConsoleLogger,
  Injectable,
  LoggerService,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './account/entity/account.entity';
import { Repository } from 'typeorm';
import { compareSync, hash } from 'bcryptjs';
import { User } from 'src/users/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateAccount(email: string, password: string): Promise<any> {
    const account = await this.accountRepository.findOneBy({
      email,
    });
    if (account && compareSync(password, account.password)) {
      const { password, ...result } = account;
      return result;
    }
    return null;
  }

  async login(account: Omit<Account, 'password'>) {
    const payload = { email: account.email, sub: account.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async createAccount(email: string, password: string): Promise<any> {
    const accountExists = await this.accountRepository.findOneBy({ email });
    if (accountExists) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await hash(password, 10);
    const user = this.userRepository.create();

    const account = this.accountRepository.create({
      email,
      user,
      password: hashedPassword,
    });
    await this.accountRepository.save(account);

    return { message: 'Account created successfully' };
  }
}
