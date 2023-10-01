import { IsEmail, IsString } from 'class-validator';

export class RegisterAccountDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
