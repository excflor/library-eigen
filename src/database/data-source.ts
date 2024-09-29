import { ConfigService } from '@nestjs/config';
import { DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { join } from 'path';

export const createDataSource = (
  configService: ConfigService,
): DataSourceOptions & SeederOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST'),
  port: +configService.get<number>('DB_PORT'),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  synchronize: false,
  migrations: [
    join(__dirname, 'dist', 'database', 'migrations', '**', '*.entity.{ts,js}'),
  ],
  seeds: [
    join(__dirname, 'dist', 'database', 'seeders', '**', '*.entity.{ts,js}'),
  ],
});
