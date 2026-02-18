import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

// Configurable logger for core services: reads LOG_LEVEL from env (DEBUG/INFO/etc)
// DEBUG: all levels (log, debug, verbose, warn, error); else standard (info/warn/error)
// Added to identify issues like profile updates, API mutations (publish/apply/withdraw)

async function bootstrap() {
  // Map env LOG_LEVEL to NestJS log levels array
  const logLevel = (process.env.LOG_LEVEL || 'INFO').toUpperCase();
  // Cast to mutable LogLevel[] to satisfy NestJS types (readonly from 'as const' causes TS error)
  const loggerLevels: ('log' | 'error' | 'warn' | 'debug' | 'verbose')[] = logLevel === 'DEBUG'
    ? ['log', 'error', 'warn', 'debug', 'verbose']
    : ['log', 'error', 'warn'];

  const app = await NestFactory.create(AppModule, {
    logger: loggerLevels, // Configures built-in logger
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.enableCors({ origin: process.env.CORS_ORIGIN ?? '*' });
  const port = process.env.PORT ?? 3002;
  await app.listen(port);
  return port;
}

bootstrap().then((port) => {
  Logger.log(`User Management Service running on http://localhost:${port}/graphql`, 'Bootstrap');
  Logger.debug(`Log level: ${process.env.LOG_LEVEL || 'INFO'} (DEBUG shows all for troubleshooting)`, 'Bootstrap');
});
