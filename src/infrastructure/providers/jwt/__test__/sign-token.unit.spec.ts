import { JwtService as NestJwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { JwtProvider } from '../jwt.provider';

describe('Providers -> Jwt -> Sign Token', () => {
  let jwtService: JwtProvider;

  const nestJwtServiceMock = {
    signAsync: jest.fn().mockResolvedValue('token')
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JwtProvider,
        {
          provide: NestJwtService,
          useValue: nestJwtServiceMock
        }
      ]
    }).compile();

    jwtService = module.get<JwtProvider>(JwtProvider);
  });

  afterEach(() => jest.clearAllMocks());

  it('should generate and return token', async () => {
    const res = await jwtService.signToken(
      {
        userId: '123',
        companyId: '123'
      },
      {
        expiresIn: '100d'
      }
    );

    expect(res).toStrictEqual('token');
    expect(nestJwtServiceMock.signAsync).toHaveBeenCalledTimes(1);
  });
});
