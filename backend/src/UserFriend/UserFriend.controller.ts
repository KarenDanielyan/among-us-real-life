import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { UserFriend } from './UserFriend.entity';
import { UserFriendService } from './UserFriend.service'; 
import { UserFriendModel } from './UserFriendModel';
import { Res } from '@nestjs/common';

@Controller('friends')
export class FriendController {
  constructor(private friendService: UserFriendService) {}

  @Get(':userId')
  async findAll(@Param('userId') userId: number, @Res() res): Promise<UserFriendModel[]> {
    return res.send(await this.friendService.getUserFriends(userId));
  }

  @Post()
  async addFriend(@Body() payload: { userid: number, friendid: number }, @Res() res): Promise<UserFriend> {
    const { userid, friendid } = payload;
    return res.send(await this.friendService.addFriend(userid, friendid));
  }

  @Delete('/:userId/:friendId')
  async remove(@Param('userId') userId: number, @Param('friendId') friendId: number, @Res() res): Promise<void> {
    return res.send(await this.friendService.removeFriend(userId, friendId));
  }
}