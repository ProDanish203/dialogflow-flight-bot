import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ChatMessageDto {
  @ApiProperty({
    description: 'The message text to send to Dialogflow',
    example: 'Hello, how can I help?',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'Message cannot be empty' })
  message!: string;

  @ApiPropertyOptional({
    description:
      'Optional session ID for maintaining conversation context. Defaults to the socket connection ID if omitted.',
    example: 'abc123-session-id',
    required: false,
  })
  @IsOptional()
  @IsString()
  sessionId?: string;
}
