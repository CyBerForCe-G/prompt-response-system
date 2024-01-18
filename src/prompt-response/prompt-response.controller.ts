// prompt-response.controller.ts
import { Controller, Post, Body, Get, Query, Param} from '@nestjs/common';
import { AppService } from 'src/app.service';
import { PromptResponse } from './prompt-response.model';

@Controller('prompt-response')
export class PromptResponseController {
  constructor(private readonly appService: AppService) {}

  @Get('get-response')
  async getFilteredData(
    @Query('user') user: string,
    @Query('modelMachine') modelMachine: string,
    @Query('startDate') startDate : string,
    @Query('endDate') endDate : string,
    ): Promise<PromptResponse[]>{
      const startDateTime = startDate ? new Date(startDate) : null;
      const endDateTime = endDate ? new Date(endDate) : null;
    return this.appService.getFilteredData(user,modelMachine, startDateTime, endDateTime);
  }

  @Get('average-latency')
  async getAverageLatenncy(): Promise<number>{
    return this.appService.getAverageLatency();
  }

  @Get('distinct/:field')
  async getDistinctValues(@Param('field') field: string): Promise<string[]>{
    return this.appService.getDistinctFields(field);
  }

  @Post('get-response')
  async savePromptResponse(@Body() data: any): Promise<any> {
    const response = this.appService.savePromptResponse(data);
    return response;
  }
}
