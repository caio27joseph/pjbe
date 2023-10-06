// refresh-token.dto.ts
import { IsString } from 'class-validator';

export class RefreshTokenDto {
  refreshToken: string;
}
