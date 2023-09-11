import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ChannelUsersService } from './ChannelUsers.service'; 
import { ChannelUser } from './ChannelUser.entity';
import { ChannelUserModel } from './ChannelUserModel';
import { Res } from '@nestjs/common';

@Controller('channelusers')
export class ChannelUsersController {
  constructor(private readonly channelUsersService: ChannelUsersService) {}

  @Get(':id')
  async getChannelUsers(@Param('id') id: number, @Res() res): Promise<ChannelUserModel[]> {
    return res.send(await this.channelUsersService.getChannelUsers(id));
  }

  @Post()
  async addUserToChannel(@Body() payload: { callinguserid: number, channelid: number, userid: number }, @Res() res): Promise<ChannelUser> {
    const { callinguserid, channelid, userid } = payload;
    return res.send(await this.channelUsersService.addUser(callinguserid, channelid, userid));
  }

  @Delete('/:callinguserid/:channelid/:userid')
  async removeUserFromChannel(@Param('callinguserid') callinguserid: number, @Param('channelid') channelid: number, @Param('userid') userid: number, @Res() res): Promise<void> {
    return res.send(await this.channelUsersService.removeUser(callinguserid, channelid, userid));
  }
}