import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
config();

const configService = new ConfigService();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: configService.get<string>('PG_Host'),
  port: parseInt(configService.get<string>('DATABASE_PORT') ?? '5432', 5432),
  username: configService.get<string>('PG_USER'),
  password: configService.get<string>('PG_PASSWORD'),
  database: configService.get<string>('PG_Database'),
  synchronize: true,
  entities: ['**/*.entity.ts'],
  migrations: ['src/database/migrations/*-migration.ts'],
  migrationsRun: false,
  logging: true,
});

export default AppDataSource;
