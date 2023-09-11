import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { UserFriend } from '../UserFriend/UserFriend.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRepository, UserFriend])],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService]
})
export class UsersModule {}
