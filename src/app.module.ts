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
    MongooseModule.forRoot('mongodb+srv://gsayan999:wGnsflgGULP2Bv4u@cluster0.c2wtyjf.mongodb.net/?retryWrites=true&w=majority', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as any),
    MongooseModule.forFeature([{ name: 'PromptResponse', schema: PromptResponseSchema }]),
  ],
  controllers: [AppController, PromptResponseController],
  providers: [AppService, PromptResponseService],
})
export class AppModule {}
