import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { configService } from './config/config.service';
import { BadRequestException, ValidationError, ValidationPipe } from '@nestjs/common';
import { ValidationExceptionFilter } from './config/validationExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose']
  });

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new ValidationExceptionFilter())

  const options = new DocumentBuilder()
    .setTitle('API docs')
    .addTag('ClickUp')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('swagger', app, document);
  app.enableCors();
  // Starts listening for shutdown hooks
  app.enableShutdownHooks();
  await app.listen(configService.getPort() || 3000);
}
bootstrap();

