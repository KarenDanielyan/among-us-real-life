import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne } from 'typeorm';
import { User } from '../Users/user.entity'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../Users/user.repository';
import { UserFriend } from './UserFriend.entity';
import { FriendController } from './UserFriend.controller';
import { UserFriendService } from './UserFriend.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRepository, UserFriend])],
  controllers: [FriendController],
  providers: [UserFriendService, UserRepository],
})
export class UsersFriendModule {}