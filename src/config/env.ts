import typeOrmConfig from './typeorm/config';

export default () => ({
  typeorm: { ...typeOrmConfig() }
});
