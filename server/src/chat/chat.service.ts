import { HttpStatus, Injectable } from '@nestjs/common';
import { throwError } from '../common/helpers/helpers';
import { DialogflowService } from './dialogflow.service';

@Injectable()
export class ChatService {
  constructor(private readonly dialogflowService: DialogflowService) {}

  async sendToDialogflow(message: string, sessionId: string): Promise<string> {
    const trimmedMessage = message?.trim();

    if (!trimmedMessage)
      throw throwError('Message cannot be empty', HttpStatus.BAD_REQUEST);

    return this.dialogflowService.detectIntent(sessionId, trimmedMessage);
  }
}
