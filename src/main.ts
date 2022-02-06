import { getLogLevels } from './utils/getLogLevels';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: getLogLevels(process.env.NODE_ENV === 'production'),
  });

  if (process.env.NODE_ENV === 'development') {
    app.enableCors();
  }

  await app.listen(3000);
}
bootstrap();
