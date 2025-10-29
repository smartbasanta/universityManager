import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.PG_Host,
  port: 5432,
  username: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_Database,
  synchronize: true,
  logging: true,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [],
  migrationsRun: false,
  extra: {
    options: '-c timezone=UTC',
  },
  // ssl: {
  //     rejectUnauthorized: false,
  // },
};

export default databaseConfig;
