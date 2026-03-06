import s3Config from './aws/s3/config';
import jwtConfig from './jwt/config';
import mailerConfig from './mailer/config';
import typeOrmConfig from './typeorm/config';

export default () => ({
  s3: { ...s3Config() },
  jwt: { ...jwtConfig() },
  mailer: { ...mailerConfig() },
  typeorm: { ...typeOrmConfig() }
});
