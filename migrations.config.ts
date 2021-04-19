import * as config from 'config';
import { ConnectionOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

module.exports = {
  ...config.get<ConnectionOptions>('typeorm'),
  namingStrategy: new SnakeNamingStrategy(),
};
