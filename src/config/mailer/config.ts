export type MailerConfig = {
  transport: {
    host: string;
    port: number;
    secure: boolean;
    auth: {
      user: string;
      pass: string;
    };
  };
  defaults: {
    from: string;
  };
};

export default (): MailerConfig => ({
  transport: {
    host: process.env.MAIL_HOST!,
    port: Number(process.env.MAIL_PORT),
    secure: false,
    auth: {
      user: process.env.MAIL_USERNAME!,
      pass: process.env.MAIL_PASSWORD!
    }
  },
  defaults: {
    from: process.env.MAIL_FROM!
  }
});
