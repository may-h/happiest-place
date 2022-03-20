import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { DotenvParseOutput } from 'dotenv';

export class ConfigService {
  private readonly envConfig: DotenvParseOutput;

  constructor() {
    this.envConfig = dotenv.config().parsed;
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
