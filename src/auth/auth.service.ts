import {
  ConflictException,
  ConsoleLogger,
  Injectable,
  LoggerService,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from './account/entity/account.entity';
import { Repository } from 'typeorm';
import { compareSync, hash } from 'bcryptjs';
import { User } from 'src/users/user/entities/user.entity';
import { Session } from './account/entity/session.entity';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
    @InjectRepository(Session)
    private readonly sessionRepo: Repository<Session>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateAccount(email: string, password: string): Promise<any> {
    const account = await this.accountRepo.findOneBy({
      email,
    });
    if (account && compareSync(password, account.password)) {
      const { password, ...result } = account;
      return result;
    }
    return null;
  }

  async login(account: Account) {
    const payload = { email: account.email, sub: account.userId };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.generateRefreshToken(account); // Assuming you have this method

    // Create a new session
    const session = this.sessionRepo.create({
      account: account,
      refreshToken: refreshToken,
      refreshTokenExp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days for example
      // ... any other session details you want to store
    });
    await this.sessionRepo.save(session);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async createAccount(email: string, password: string): Promise<any> {
    const accountExists = await this.accountRepo.findOneBy({ email });
    if (accountExists) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await hash(password, 10);
    const user = this.userRepo.create();

    const account = this.accountRepo.create({
      email,
      user,
      password: hashedPassword,
    });
    await this.accountRepo.save(account);

    return { message: 'Account created successfully' };
  }

  async refreshAccessToken(refreshToken: string): Promise<any> {
    const session = await this.sessionRepo.findOneBy({ refreshToken });

    if (!session) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (session.refreshTokenExp < new Date()) {
      await this.sessionRepo.delete({
        id: session.id,
      });
      throw new UnauthorizedException('Refresh token has expired');
    }

    const payload = {
      email: session.account.email,
      sub: session.account.userId,
    };
    const newAccessToken = this.jwtService.sign(payload);
    const newRefreshToken = this.generateRefreshToken(session.account);

    session.refreshToken = newRefreshToken;
    session.refreshTokenExp = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.sessionRepo.save(session);

    return {
      access_token: newAccessToken,
      refresh_token: newRefreshToken,
    };
  }
  private generateRefreshToken(account: Account): string {
    return randomBytes(32).toString('hex');
  }
  async validateTokenForSubscription(
    jwtToken: string,
  ): Promise<Account | null> {
    try {
      const payload = this.jwtService.verify(jwtToken);
      if (payload && payload.sub) {
        const account = await this.accountRepo.findOneBy({
          userId: payload.sub,
        });
        const { password, ...result } = account;
        return result as Account;
      }
    } catch (error) {
      return null;
    }
    return null;
  }
}
