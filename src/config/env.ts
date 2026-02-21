import jwtConfig from './jwt/config';
import mailerConfig from './mailer/config';
import typeOrmConfig from './typeorm/config';

export default () => ({
  jwt: { ...jwtConfig() },
  mailer: { ...mailerConfig() },
  typeorm: { ...typeOrmConfig() }
});
