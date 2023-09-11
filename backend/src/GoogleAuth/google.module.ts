import { Module } from '@nestjs/common';
import { GoogleController } from './Google.controller';
import { GoogleService } from './Google.service';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [],
  controllers: [GoogleController],
  providers: [GoogleService, GoogleStrategy],
})
export class GoogleModule { }