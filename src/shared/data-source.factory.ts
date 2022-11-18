import { DataSource } from 'typeorm';

import { EnvironmentService } from '@shared/environment';
import { Type } from '@nestjs/common';

/**
 * Only used for typeorm cli.
 */
export default class DataSourceFactory {
  public static create(envPath: string[], entities: Type[]): DataSource {
    EnvironmentService.loadFiles(envPath);

    return new DataSource({
      entities: entities,
      type: 'postgres',
      url: `postgresql://${process.env.POSTGRESQL_USER}:${process.env.POSTGRESQL_PASSWORD}@${process.env.POSTGRESQL_HOST}:${process.env.POSTGRESQL_PORT}/${process.env.POSTGRESQL_DATABASE}`,
    });
  }
}
