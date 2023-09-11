import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserPin } from './Userpins.entity';
import { UserPinsController } from './Userpins.controller';
import { UserPinsService } from './Userpins.service';
import { User } from '../Users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserPin, User])],
  controllers: [UserPinsController],
  providers: [UserPinsService],
  exports: [UserPinsService]
})
export class UserPinsModule {}
