import { JwtService as NestJwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { JwtProvider } from '../jwt.provider';

describe('Providers -> Jwt -> Verify Token', () => {
  let jwtService: JwtProvider;

  const nestJwtServiceMock = {
    verify: jest.fn().mockReturnValue({ iat: '1615302024' })
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

  it('should verify token', () => {
    const token = 'token';
    const res = jwtService.verifyToken(token);

    expect(res).toStrictEqual({ iat: '1615302024' });
    expect(nestJwtServiceMock.verify).toHaveBeenCalledTimes(1);
  });
});
