import { HttpException, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { ChatMessageDto } from './dto/chat-message.dto';

@WebSocketGateway({
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(private readonly chatService: ChatService) {}

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: ChatMessageDto,
  ) {
    try {
      const sessionId = payload.sessionId || client.id;
      const trimmedMessage = payload.message?.trim();

      if (!trimmedMessage) {
        client.emit('error', { message: 'Message cannot be empty' });
        return;
      }

      const fulfillmentText = await this.chatService.sendToDialogflow(
        payload.message,
        sessionId,
      );

      client.emit('response', fulfillmentText);
    } catch (error) {
      const message =
        error instanceof HttpException
          ? this.extractHttpExceptionMessage(error)
          : error instanceof Error
            ? error.message
            : 'Failed to process message';

      this.logger.error(`Message handling failed for ${client.id}: ${message}`);
      client.emit('error', { message });
    }
  }

  private extractHttpExceptionMessage(exception: HttpException): string {
    const response = exception.getResponse();

    if (typeof response === 'string') return response;

    if (
      typeof response === 'object' &&
      response !== null &&
      'message' in response
    ) {
      const message = (response as { message: string | string[] }).message;
      return Array.isArray(message) ? message[0] : message;
    }

    return exception.message;
  }
}
