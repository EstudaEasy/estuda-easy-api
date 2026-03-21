import abacatePayConfig from './abacatepay/config';
import s3Config from './aws/s3/config';
import geminiConfig from './gemini/config';
import googleConfig from './google/config';
import jwtConfig from './jwt/config';
import mailerConfig from './mailer/config';
import openaiConfig from './openai/config';
import typeOrmConfig from './typeorm/config';

export default () => ({
  abacatepay: { ...abacatePayConfig() },
  s3: { ...s3Config() },
  jwt: { ...jwtConfig() },
  mailer: { ...mailerConfig() },
  gemini: { ...geminiConfig() },
  google: { ...googleConfig() },
  openai: { ...openaiConfig() },
  typeorm: { ...typeOrmConfig() }
});
