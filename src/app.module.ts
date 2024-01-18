// app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PromptResponseSchema } from './prompt-response/prompt-response.model';
import { PromptResponseController } from './prompt-response/prompt-response.controller';
import { PromptResponseService } from './prompt-response/prompt-response.service';


@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any),
    MongooseModule.forFeature([{ name: 'PromptResponse', schema: PromptResponseSchema }]),
  ],
  controllers: [AppController, PromptResponseController],
  providers: [AppService, PromptResponseService],
})
export class AppModule {}
