import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3001, function () {
    console.log('App is connected and running on port 3001');
  });
}
bootstrap();
