import { DataSource, DataSourceOptions } from 'typeorm';
import { CreateMembersTable1727602549708 } from './migrations/1727602549708-CreateMembersTable';
import * as dotenv from 'dotenv';
import Member from '../members/entities/member.entity';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Member],
  synchronize: false,
  migrations: [CreateMembersTable1727602549708],
  migrationsRun: false,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
