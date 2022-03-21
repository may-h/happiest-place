import * as dotenv from 'dotenv';

export class ConfigService {
  constructor() {
    dotenv.config();
  }

  get(key: string): string {
    return process.env[key];
  }
}
