// prompt-response.model.ts
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class PromptResponse extends Document {
  @Prop({default: Date.now})
  CreatedAt: Date;

  @Prop({required: true})
  success: boolean;

  @Prop({required: true})
  prompt: string;

  @Prop({required: true})
  response: string;

  @Prop({required: true})
  user: string;

  @Prop({required: true})
  modelMachine: string;

  @Prop({required: true})
  Latency: number;

  @Prop({required: true})
  Prompt_Tokens: number;

  @Prop({required: true})
  Completion_Tokens: number;

  @Prop({required: true})
  Total_Tokens: number

  static createdAtQuery(startDate: Date, endDate: Date){
    return {
      CreatedAt: {$gte: startDate, $lte: endDate},
    };
  }
}

export const PromptResponseSchema = SchemaFactory.createForClass(PromptResponse);
