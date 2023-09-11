// users.service.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../Users/user.entity';
import { CreateUserDto } from './addUser.dto';

@Injectable()
export class AddUsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.id_42 = createUserDto.ID_42;
    user.displayname = createUserDto.displayName;
    user.avatarurl = createUserDto.avatarUrl;
    user.istwofactorenabled = createUserDto.isTwoFactorEnabled;
    user.email = createUserDto.email;
    user.wins = createUserDto.wins;
    user.losses = createUserDto.losses;
    return this.userRepository.save(user);
  }

  async delete(id: string): Promise<void> {
    // Implement your deletion logic here
    await this.userRepository.delete(id);
  }
}
