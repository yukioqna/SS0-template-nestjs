import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from '../configs.constants';

export const typeOrmConfig: TypeOrmModule = {
  type: databaseConfig.type,
  host: databaseConfig.host,
  port: databaseConfig.port,
  username: databaseConfig.username,
  password: databaseConfig.password,
  database: databaseConfig.database,
  // tslint:disable-next-line:prefer-template
  entities: [__dirname + '/../../**/*.entity.{js,ts}'],
  synchronize: databaseConfig.synchronize,
};
