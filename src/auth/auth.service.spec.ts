import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Account } from './account/entity/account.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';

describe('AuthService', () => {
  let service: AuthService;
  let mockJwtService: {
    sign: jest.Mock;
  };
  let mockAccountRepository: {
    findOneBy: jest.Mock;
  };

  beforeEach(async () => {
    mockJwtService = {
      sign: jest.fn(),
    };

    mockAccountRepository = {
      findOneBy: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        {
          provide: getRepositoryToken(Account),
          useValue: mockAccountRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('User Validation (validateUser method)', () => {
    it('should return user data if valid credentials are provided', async () => {
      const testAccount = { username: 'testuser', password: 'hashedPassword' };
      mockAccountRepository.findOneBy.mockResolvedValueOnce(testAccount);

      // Mock bcrypt to return true indicating password match
      jest.spyOn(bcrypt, 'compareSync').mockReturnValueOnce(true as any);

      const result = await service.validateUser('testuser', 'testpassword');
      expect(result).toBeDefined();
      expect(result.username).toBe('testuser');
    });

    it('should return null if invalid credentials are provided', async () => {
      const testAccount = { username: 'testuser', password: 'hashedPassword' };
      mockAccountRepository.findOneBy.mockResolvedValueOnce(testAccount);

      // Mock bcrypt to return false indicating password mismatch
      jest.spyOn(bcrypt, 'compareSync').mockReturnValueOnce(false as any);

      const result = await service.validateUser('testuser', 'wrongpassword');
      expect(result).toBeNull();
    });
  });

  describe('JWT Token Generation (login method)', () => {
    it('should return a JWT token when given a valid user object', async () => {
      const user = { username: 'testuser', userId: 1 };
      mockJwtService.sign.mockReturnValueOnce('mockedJwtToken');

      const result = await service.login(user);
      expect(result.access_token).toBe('mockedJwtToken');
    });

    // This test could be redundant since there's no direct failure scenario in the 'login' method
    // But for the sake of covering possible issues, we can mock an error scenario
    it('should throw an error if JWT signing fails', async () => {
      const user = { username: 'testuser', userId: 1 };
      mockJwtService.sign.mockImplementation(() => {
        throw new Error('JWT Sign Error');
      });

      await expect(service.login(user)).rejects.toThrow('JWT Sign Error');
    });
  });
});
