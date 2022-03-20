import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { DotenvParseOutput } from 'dotenv';

export class ConfigService {
  private readonly envConfig: DotenvParseOutput;
  private result;

  constructor() {
    this.result = dotenv.config();
    this.envConfig = this.result.parsed;
  }

  get(key: string): string {
    console.log(this.result);
    console.log(this.envConfig);
    return this.envConfig[key];
  }
}
