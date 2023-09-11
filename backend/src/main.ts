import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import { IoAdapter } from '@nestjs/platform-socket.io';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

// import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin : "*"
  })
  app.useWebSocketAdapter(new IoAdapter(app));

  const config = new DocumentBuilder()
    .setTitle('Transcendence')
    .setDescription('Transcendence API')
    .setVersion('1.0')
    .addTag('ts')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  //const configService = app.get(ConfigService);
  // const port = configService.get('port');
  await app.listen(7000,()=>{console.log("server is listening on port 7000!")});
}
bootstrap();
