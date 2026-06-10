import { IoAdapter } from '@nestjs/platform-socket.io';
import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ServerOptions } from 'socket.io';

export class SocketIoAdapter extends IoAdapter {
  constructor(private readonly app: INestApplication) {
    super(app);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const configService = this.app.get(ConfigService);
    const corsOrigins =
      configService.get<string>('CORS_ORIGINS') || 'http://localhost:3000';

    return super.createIOServer(port, {
      ...options,
      cors: {
        origin: corsOrigins.split(','),
        credentials: true,
      },
    });
  }
}
