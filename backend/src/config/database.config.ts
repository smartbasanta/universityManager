import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { join } from 'path';

// This function builds the core configuration object
const typeOrmConfig = (): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT ?? '5432', 10) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // synchronize should be false in production! Controlled by .env
  // synchronize: process.env.DB_SYNCHRONIZE === 'true',
  synchronize: true,
  
  // logging: process.env.NODE_ENV === 'development', // Log only in development
  logging: true, // Log only in development
  
  // IMPORTANT: Use the correct path to your entities
  // It should point from the compiled `dist` folder back to your source
  // entities: [__dirname, '/../../src/model/**/*.entity{.ts,.js}'],
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  
  migrations: [__dirname, '/../database/migrations/*-migration{.ts,.js}'],
  migrationsRun: false, // Recommended to run migrations manually via CLI
  extra: {
    options: '-c timezone=UTC',
  },
  // ssl: process.env.NODE_ENV === 'production' 
  //   ? { rejectUnauthorized: false } // Example for services like Heroku/Render
  //   : false,
  }
);

// Register the config for NestJS DI container
export const databaseConfig = registerAs('database', typeOrmConfig);

// Create a DataSource for the TypeORM CLI
export const AppDataSource = new DataSource(typeOrmConfig() as DataSourceOptions);