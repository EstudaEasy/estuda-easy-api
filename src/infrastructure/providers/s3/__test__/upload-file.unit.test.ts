import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { S3Provider } from '../s3.provider';

describe('Providers -> S3 -> Upload File', () => {
  let s3Provider: S3Provider;

  const bucketName = 'test-bucket';

  const s3ClientMock = {
    send: jest.fn().mockResolvedValue({})
  };

  const configServiceMock = {
    getOrThrow: jest.fn().mockReturnValue(bucketName)
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

  it('should upload file successfully and return url', async () => {
    const key = 'test/file.jpg';
    const buffer = Buffer.from('test');
    const contentType = 'image/jpeg';

    const result = await s3Provider.uploadFile(key, buffer, contentType);

    expect(result).toStrictEqual({ url: `https://${bucketName}.s3.amazonaws.com/test/file.jpg` });
    expect(s3ClientMock.send).toHaveBeenCalledTimes(1);
    expect(s3ClientMock.send).toHaveBeenCalledWith(
      expect.objectContaining({
        input: expect.objectContaining({
          Bucket: bucketName,
          Key: key,
          Body: buffer,
          ContentType: contentType
        })
      })
    );
  });

  it('should throw error if S3 upload fails', async () => {
    s3ClientMock.send.mockRejectedValueOnce(new Error('S3 error'));

    const key = 'test/file.jpg';
    const buffer = Buffer.from('test');
    const contentType = 'image/jpeg';

    await expect(s3Provider.uploadFile(key, buffer, contentType)).rejects.toThrow('S3 error');
    expect(s3ClientMock.send).toHaveBeenCalledTimes(1);
  });
});
