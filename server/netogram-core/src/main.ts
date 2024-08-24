import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import * as admin from 'firebase-admin';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  const serviceAccount = require('../configs/private-key.json');
  if(!admin.apps.length){
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: "gs://social-network-29cc2.appspot.com"
    });
  }
  app.enableCors()
  await app.listen(2121);
}
bootstrap();
