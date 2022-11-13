import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param } from '@nestjs/common';

import { AppService } from '@services/app.service';
@ApiTags('Test route')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello/:lang')
  @ApiOperation({ summary: 'Test routing with an "Hello World"' })
  @ApiParam({
    allowEmptyValue: true,
    description:
      "The language of the 'hello'. Default is english. 'ru' will send an error. ",
    enum: ['fr', 'en', 'ru'],
    name: 'lang',
  })
  @ApiResponse({ description: 'OK', status: 200 })
  getHello(): Record<string, string> {
    return this.appService.getHello();
  }
}
