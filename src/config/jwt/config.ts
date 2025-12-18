export type JwtConfig = {
  accessSecret: string;
  refreshSecret: string;
};

export default (): JwtConfig => ({
  accessSecret: process.env.JWT_ACCESS_SECRET as string,
  refreshSecret: process.env.JWT_REFRESH_SECRET as string
});
