import s3Config from './aws/s3/config';
import geminiConfig from './gemini/config';
import jwtConfig from './jwt/config';
import mailerConfig from './mailer/config';
import openaiConfig from './openai/config';
import typeOrmConfig from './typeorm/config';

export default () => ({
  s3: { ...s3Config() },
  jwt: { ...jwtConfig() },
  mailer: { ...mailerConfig() },
  gemini: { ...geminiConfig() },
  openai: { ...openaiConfig() },
  typeorm: { ...typeOrmConfig() }
});
