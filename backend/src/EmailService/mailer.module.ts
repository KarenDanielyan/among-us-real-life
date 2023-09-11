import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { OtpController } from './otp.controller';
import { OtpService } from './otp.service';
import { User } from '../Users/user.entity';
import { UserPin } from '../TwoFactor/Userpins.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
 
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.sendgrid.net',
        auth: {
          user: 'apikey',
          pass: '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',
        },
      }
    }),
    TypeOrmModule.forFeature([User, UserPin])
  ],
  controllers: [OtpController],
  providers: [OtpService],
  exports: [OtpService]
})
export class MailModule {}