import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { BadRequestException } from '@nestjs/common/exceptions';
import { User } from '../Users/user.entity';
import { SentMessageInfo } from 'nodemailer';
import { UserPin } from '../TwoFactor/Userpins.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class OtpService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(UserPin)
    private userPinRepository: Repository<UserPin>,
    private mailService: MailerService
  ) {}

  async GenerateOtpAndSend(userid: number): Promise<SentMessageInfo> {
    const user = await this.usersRepository.findOne({ where: { id: userid } });
    if (!user || user.istwofactorenabled === false || !user.twofactoremail)
      throw new BadRequestException();

    const min = 100000;
    const max = 999999;
    const randomNumber = Math.floor(Math.random() * (max - min + 1) + min);
    const otp = randomNumber.toString()

    var response = await this.mailService.sendMail({
        to: user.twofactoremail,
        from:"grigoryana149@gmail.com",
        subject: 'OTP for Two Factor Verification',
        text: `Your OTP to login: ${otp}`, 
    });
    console.log(response);
    const responseCode = response.response.split(" ")[0];

    if (responseCode === "250") {
      var existing = await this.userPinRepository.findOne({ where: { userid: userid } });
      if (!existing)
      {
        existing = new UserPin();
        existing.userid = userid;
      }
      existing.pin = await bcrypt.hash(otp, 10);
      if (!await this.userPinRepository.save(existing))
          throw new InternalServerErrorException();
    }
    else {
      throw new InternalServerErrorException();
    }
  }
}
