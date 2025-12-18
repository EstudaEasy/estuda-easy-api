import jwtConfig from './jwt/config';
import typeOrmConfig from './typeorm/config';

export default () => ({
  jwt: { ...jwtConfig() },
  typeorm: { ...typeOrmConfig() }
});
