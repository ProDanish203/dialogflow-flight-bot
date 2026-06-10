import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { DialogflowService } from './dialogflow.service';

@Module({
  providers: [
    ChatGateway,
    ChatService,
    DialogflowService,
  ],
})
export class ChatModule {}
