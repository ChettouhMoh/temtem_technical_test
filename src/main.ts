// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import * as basicAuth from 'express-basic-auth';
import { ValidationPipe } from '@nestjs/common';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Protect Swagger with a password
  app.use(
    ['/api/docs', '/api/docs-json'], // Protect both the UI and the JSON endpoint
    basicAuth({
      users: { [process.env.SWAGGER_USER]: process.env.SWAGGER_PASSWORD },
      challenge: true, // Enables the browser prompt
    }),
  );
  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('temtem technical test')
    .setDescription('API documentation for temtem')
    .setVersion('1.0')
    .addTag('temtem')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // docs available at http://localhost:3000/api/docs

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
