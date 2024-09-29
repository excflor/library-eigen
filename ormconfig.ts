import { ConfigService } from '@nestjs/config';
import { createDataSource } from 'src/database/data-source';

const configService = new ConfigService();
const dataSource = createDataSource(configService);

export default dataSource;
