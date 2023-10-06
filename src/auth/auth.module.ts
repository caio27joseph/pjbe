import { ConsoleLogger, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AccountModule } from './account/account.module';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { Account } from './account/entity/account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { User } from 'src/users/user/entities/user.entity';
import { Session } from './account/entity/session.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, User, Session]),
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30m' },
    }),
    AccountModule,
  ],
  providers: [LocalStrategy, AuthService, JwtStrategy, ConsoleLogger],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
