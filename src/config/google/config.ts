export type GoogleConfig = {
  auth: {
    clientId: string;
    clientSecret: string;
  };
};

export default (): GoogleConfig => ({
  auth: {
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!
  }
});
