import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';

export class ConfigService {
  constructor() {
    // dotenv.config();
  }

  get(key: string): string {
    return process.env[key];
  }
}
