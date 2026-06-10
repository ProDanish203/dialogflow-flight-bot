import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from './common/filters/http-client-exception.filter';
import { SocketIoAdapter } from './common/adapters/socket-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Create Socket.IO adapter
  app.useWebSocketAdapter(new SocketIoAdapter(app));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 8000;
  const CORS_ORIGINS =
    configService.get<string>('CORS_ORIGINS') || 'http://localhost:3000';

  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters(new HttpExceptionFilter());

  app.enableCors({
    origin: CORS_ORIGINS.split(','),
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    exposedHeaders: '*',
    maxAge: 3600,
  });

  const config = new DocumentBuilder()
    .setTitle('Dialog Flow ES Chatbot API')
    .setDescription('Dialog Flow ES Chatbot API Documentation')
    .setVersion('1.0')
    .addTag('Dialog Flow ES Chatbot API')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port, '0.0.0.0', () => {
    console.log(`Server is running on http://0.0.0.0:${port}`);
  });
}
bootstrap();
