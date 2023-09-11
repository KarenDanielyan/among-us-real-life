import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserPin } from './Userpins.entity';
import { BadRequestException } from '@nestjs/common/exceptions';
import * as bcrypt from 'bcrypt';
import { User } from '../Users/user.entity';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class UserPinsService {
  constructor(
    @InjectRepository(UserPin)
    private userPinsRepository: Repository<UserPin>,
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async EnableTF(userid: number, email: string): Promise<void> {
    if (!email)
      throw new BadRequestException("email field is required");
    var user = await this.usersRepository.findOne({ where: { id: userid } });
    if (!user)
      throw new BadRequestException("User not found");
    user.istwofactorenabled = true;
    user.twofactoremail = email;
    if (!await this.usersRepository.save(user))
        throw new InternalServerErrorException();
  }

  async DisableTF(userid: number): Promise<void> {
    var user = await this.usersRepository.findOne({ where: { id: userid } });
    if (!user || user.istwofactorenabled === false)
      throw new BadRequestException();
    user.istwofactorenabled = false;
    if (!await this.usersRepository.save(user))
      throw new InternalServerErrorException();
  }

  async CheckPin(userid: number, pin: string): Promise<object> {
    var userPin = await this.userPinsRepository.findOne({ where: { userid: userid } });
    if (!userPin)
        throw new BadRequestException();
    const isverified = await bcrypt.compare(pin, userPin.pin);
    if (isverified)
    {
      if (!await this.userPinsRepository.remove(userPin))
        throw new InternalServerErrorException();
    }
    return { verify: isverified }
  }

  async ChangePin(userid: number, oldpin: string, newpin: string): Promise<void> {
    var userPin = await this.userPinsRepository.findOne({ where: { userid: userid } });
    if (!userPin)
      throw new BadRequestException();
    if (!await bcrypt.compare(oldpin, userPin.pin))
      throw new ForbiddenException();
    userPin.pin = await bcrypt.hash(newpin, 10);
    if (!await this.userPinsRepository.save(userPin))
      throw new InternalServerErrorException();
  }

  async DeletePin(userid: number, pin: string): Promise<void> {
    var userPin = await this.userPinsRepository.findOne({ where: { userid: userid } });
    if (!userPin)
      throw new BadRequestException();
    if (!await bcrypt.compare(pin, userPin.pin))
      throw new ForbiddenException();
    await this.userPinsRepository.remove(userPin);
    var user = await this.usersRepository.findOne({ where: { id: userid } });
    user.istwofactorenabled = false;
    if (!await this.usersRepository.save(user))
        throw new InternalServerErrorException();
  }
}
