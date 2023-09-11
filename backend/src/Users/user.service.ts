import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, getRepository } from 'typeorm';
import { User, UserStatus } from './user.entity';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { Raw } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneById(userId: number): Promise<User> {
    var user = await this.userRepository.findOne({ where: { id_42: userId } });
    if (!user)
      return null;
    return user;
  }
  
  async findOneByDisplayName(displayName: string): Promise<User> {
    var user = this.userRepository.findOne({ where: { displayname: displayName } });
    if (!user)
      throw new NotFoundException("User not found");
    return user;
  }

  async findOneByPKId(userid: number): Promise<User> {
    var user = await this.userRepository.findOne({ where: { id: userid } });
    if (!user)
      throw new NotFoundException("User not found");
    return user;
  }

  async updateUserInfo(user: User): Promise<User> {
    return await this.userRepository.save(user);
  }

  async updateGameStats(user: User, isWinner:boolean): Promise<void> {
    var updated = isWinner ? await this.userRepository.update(user.id, { wins: user.wins + 1 })
             : await this.userRepository.update(user.id, { losses: user.losses + 1 }); 
    if (updated.affected == 0)
    {
      throw new InternalServerErrorException();
    }
  }

  async updateDisplayName(userid: number, nickname: string): Promise<void> {
    const lowercaseNickname = nickname.toLowerCase();

    const checkNick = await this.userRepository.findOne({
      where: { displayname: Raw(alias => `LOWER(${alias}) = '${lowercaseNickname}'`) },
    });

    if (checkNick)
    {
      throw new BadRequestException("Display name already exists");
    }
    if ((await this.userRepository.update(userid, { displayname: nickname })).affected == 0)
    {
      throw new BadRequestException("User not found");
    }
  }

  async updateStatus(userid: number, status: UserStatus): Promise<void> {
    if (!Object.values(UserStatus).includes(status)) {
      throw new BadRequestException("Invalid status value");
    }
    if ((await this.userRepository.update(userid, { status: status })).affected == 0)
    {
      throw new BadRequestException("User not found");
    }
  }
}
