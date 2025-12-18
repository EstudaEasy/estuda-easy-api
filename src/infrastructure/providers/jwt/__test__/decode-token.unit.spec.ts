import { JwtService as NestJwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { JwtProvider } from '../jwt.provider';

describe('Providers -> Jwt -> Decode Token', () => {
  let jwtService: JwtProvider;

  const nestJwtServiceMock = {
    decode: jest.fn().mockReturnValue({ userId: '123' })
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

  it('should decode token and return payload', () => {
    const token = 'token';
    const res = jwtService.decodeToken(token);

    expect(res).toStrictEqual({ userId: '123' });
    expect(nestJwtServiceMock.decode).toHaveBeenCalledTimes(1);
  });

  it('should return null if token is invalid', () => {
    nestJwtServiceMock.decode.mockReturnValue(null);

    const token = 'invalid-token';
    const res = jwtService.decodeToken(token);

    expect(res).toBeNull();
    expect(nestJwtServiceMock.decode).toHaveBeenCalledTimes(1);
  });
});
