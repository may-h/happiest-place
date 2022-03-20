import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';

export class ConfigService {
  constructor() {
    dotenv.config();
  }

  get(key: string): string {
    console.log(key);
    console.log(process.env[key]);
    return process.env[key];
  }
}
