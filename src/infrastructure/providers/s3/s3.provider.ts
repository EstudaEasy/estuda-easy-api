import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Provider {
  private bucketName: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly s3Client: S3Client
  ) {
    this.bucketName = this.configService.getOrThrow<string>('S3_BUCKET_NAME');
  }

  async uploadFile(key: string, buffer: Buffer, contentType: string): Promise<{ url: string }> {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: buffer,
      ContentType: contentType
    });

    await this.s3Client.send(command);
    return { url: this.getFileUrl(key) };
  }

  async deleteFile(url: string): Promise<void> {
    const key = this.getKeyFromUrl(url);
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key
      });

      await this.s3Client.send(command);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  private getFileUrl(key: string): string {
    return `https://${this.bucketName}.s3.amazonaws.com/${key}`;
  }

  private getKeyFromUrl(url: string): string {
    try {
      const pathname = new URL(url).pathname;
      return decodeURIComponent(pathname).substring(1);
    } catch {
      throw new InternalServerErrorException('Invalid S3 URL');
    }
  }
}
