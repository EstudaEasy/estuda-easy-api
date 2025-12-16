import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export type TypeOrmConfig = TypeOrmModuleOptions;

export default (): TypeOrmConfig => ({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: process.env.DB_SSL === 'true',
  entities: ['dist/infrastructure/database/typeorm/models/**/*{.ts,.js}'],
  migrations: ['dist/infrastructure/database/typeorm/migrations/*{.ts,.js}'],
  subscribers: ['dist/infrastructure/database/typeorm/subscribers/**/*{.ts,.js}'],
  synchronize: false,
  migrationsRun: false,
  logging: false
});
