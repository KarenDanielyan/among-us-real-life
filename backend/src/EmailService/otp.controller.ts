import { Controller, Post, Body, Res } from '@nestjs/common';
import { OtpService } from './otp.service';
import { SentMessageInfo } from 'nodemailer';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('generate')
  async GenerateOtp(@Body() payload: { userid: number }, @Res() res): Promise<SentMessageInfo> {
    const { userid } = payload;
    return res.send(await this.otpService.GenerateOtpAndSend(userid));
  }
}
