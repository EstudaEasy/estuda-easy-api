import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';

import { MailerProvider } from '../mailer.provider';

describe('Providers -> Mailer -> Send', () => {
  let mailerProvider: MailerProvider;

  const mailerServiceMock = {
    sendMail: jest.fn().mockResolvedValue('sent')
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailerProvider,
        {
          provide: MailerService,
          useValue: mailerServiceMock
        }
      ]
    }).compile();

    mailerProvider = module.get<MailerProvider>(MailerProvider);
  });

  afterEach(() => jest.clearAllMocks());

  it('should send mail and return result', async () => {
    const options = { to: 'a@b.com', subject: 't' };
    const res = await mailerProvider.send(options);

    expect(res).toStrictEqual('sent');
    expect(mailerServiceMock.sendMail).toHaveBeenCalledTimes(1);
    expect(mailerServiceMock.sendMail).toHaveBeenCalledWith(options);
  });
});
