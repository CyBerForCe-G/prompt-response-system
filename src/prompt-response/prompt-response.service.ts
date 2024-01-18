// prompt-response.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import axios from 'axios';
import { Model } from 'mongoose';
import { PromptResponse } from './prompt-response.model';

@Injectable()
export class PromptResponseService {
  constructor(@InjectModel('PromptResponse') private readonly model: Model<PromptResponse>) {}

  async getDistinctFields(field: string): Promise<string[]>{
    const distinctValues = await this.model.distinct(field).exec();
    return distinctValues.map(String);
  }

  async getFilteredData(
    user: string, 
    modelMachine: string,
    startDate: Date,
    endDate: Date
    ): Promise<PromptResponse[]>{
    const filter: Record<string, any> = {};
    if (user) filter.user = user;
    if (modelMachine) filter.modelMachine = modelMachine;

    if(startDate && endDate){
      console.log('Start Date:',startDate);
      console.log('End Date:',endDate);
      filter.CreatedAt = {$gte: startDate, $lte: endDate};
    }

    const projection: Record<string, number> = {
      CreatedAt: 1, 
      success: 1, 
      user: 1, 
      prompt: 1, 
      response: 1, 
      modelMachine: 1, 
      Total_Tokens: 1, 
      Prompt_Tokens: 1,
      Completion_Tokens: 1,
      _id: 0
    }

    return this.model.find(filter, projection).exec();
  }

  async getAverageLatency(): Promise<number>{
    const result = await this.model.aggregate([{
      $group: {
        _id: null,
        averageLatency: { $avg: '$Latency' },
      },
    }
  ]);
  return result.length > 0 ? result[0].averageLatency : 0;
  }

  async savePromptResponse(data: any): Promise<any> {
    const startTime = Date.now();
    const response = await axios.post(
      process.env.API_URL,
        {
            prompt: data.prompt,
            max_tokens: 100,  
            temperature: 0.7,
        },
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.API_KEY}`,
            },
        }
    );

    const endTime = Date.now();
    const latency = endTime - startTime;

    const promptResponse = new this.model({
        CreatedAt: new Date(),
        success: true,
        prompt: data.prompt,
        response: response.data.choices[0].text,
        user: 'user1',
        modelMachine: response.data.model,
        Latency: latency,
        Prompt_Tokens: response.data.usage.prompt_tokens,
        Completion_Tokens: response.data.usage.completion_tokens,
        Total_Tokens: response.data.usage.prompt_tokens + response.data.usage.completion_tokens,
    })
    console.log('Data inserted successfully\n');
    console.log('Latency',latency);
    return await promptResponse.save();
  }
}
