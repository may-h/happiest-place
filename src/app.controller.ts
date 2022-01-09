import {Controller, Get, Render} from '@nestjs/common';
import { AppService } from './app.service';
import {ConfigService} from "@nestjs/config";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private configService: ConfigService) {}

  @Get()
  @Render('index')
  root() {
    console.log(this.configService.get('database.host'));
    console.log(this.configService.get('DATABASE_HOST'));
    return { title: 'Happiest Place 🧳' };
  }
}
