import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get } from '@nestjs/common';

import { AppService } from '@services/app.service';
@ApiTags('Test route')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  @ApiOperation({ summary: 'Test routing with an "Hello World"' })
  @ApiResponse({ description: 'OK', status: 200 })
  getHello(): Record<string, string> {
    return this.appService.getHello();
  }
}
