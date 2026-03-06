import { S3Client } from '@aws-sdk/client-s3';
import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { S3Provider } from '../s3.provider';

describe('Providers -> S3 -> Delete File', () => {
  let s3Provider: S3Provider;

  const s3ClientMock = {
    send: jest.fn().mockResolvedValue({})
  };

  const configServiceMock = {
    getOrThrow: jest.fn().mockReturnValue('test-bucket')
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        S3Provider,
        {
          provide: S3Client,
          useValue: s3ClientMock
        },
        {
          provide: ConfigService,
          useValue: configServiceMock
        }
      ]
    }).compile();

    s3Provider = module.get<S3Provider>(S3Provider);
  });

  afterEach(() => jest.clearAllMocks());

  it('should delete file successfully', async () => {
    const url = 'https://test-bucket.s3.amazonaws.com/test/file.jpg';
    const key = 'test/file.jpg';

    await s3Provider.deleteFile(url);

    expect(s3ClientMock.send).toHaveBeenCalledTimes(1);
    expect(s3ClientMock.send).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          Bucket: 'test-bucket',
          Key: key
        })
      })
    );
  });

  it('should throw InternalServerErrorException if S3 delete fails', async () => {
    const error = new Error('S3 delete error');
    s3ClientMock.send.mockRejectedValueOnce(error);

    const key = 'test/file.jpg';

    await expect(s3Provider.deleteFile(key)).rejects.toThrow(InternalServerErrorException);
    expect(s3ClientMock.send).toHaveBeenCalledTimes(1);
  });
});
