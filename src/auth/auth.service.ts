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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private jwtService: JwtService,
    private logger: ConsoleLogger,
  ) {}

  async validateAccount(email: string, password: string): Promise<any> {
    this.logger.debug(email, password);

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
    const payload = { email: account.email, sub: account.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async createAccount(email: string, password: string): Promise<any> {
    const userExists = await this.accountRepository.findOneBy({ email });
    if (userExists) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await hash(password, 10);
    const user = this.accountRepository.create({
      email,
      password: hashedPassword,
    });
    await this.accountRepository.save(user);

    return { message: 'Account created successfully' };
  }
}
