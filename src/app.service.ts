// app.service.ts
import { Injectable } from '@nestjs/common';
import { PromptResponseService } from './prompt-response/prompt-response.service';
import { PromptResponse } from './prompt-response/prompt-response.model';

@Injectable()
export class AppService {
  constructor(private readonly promptResponseService: PromptResponseService) {}

  async getHello(): Promise<String>{
    return "Hello World";
  }

  async getDistinctFields(field: string): Promise<string[]>{
    return await this.promptResponseService.getDistinctFields(field);
  }

  async savePromptResponse(data: any): Promise<any> {
    return await this.promptResponseService.savePromptResponse(data);
  }

  async getFilteredData(
    user: string, 
    modelMachine: string,
    startDate: Date,
    endDate: Date
    ): Promise<PromptResponse[]>{
    return await this.promptResponseService.getFilteredData(user, modelMachine, startDate, endDate);
  }

  async getAverageLatency(): Promise<number>{
    return await this.promptResponseService.getAverageLatency();
  }
}
