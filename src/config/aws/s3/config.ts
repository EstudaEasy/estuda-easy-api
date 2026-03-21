export type S3Config = {
  region: string;
  credentials: {
    accessKeyId: string;
    secretAccessKey: string;
  };
};

export default (): S3Config => ({
  region: process.env.S3_REGION!,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!
  }
});
