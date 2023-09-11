import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { Mutelist } from './MuteList.entity';
import { MuteListService } from './MuteList.service';
import { User } from '../Users/user.entity';
import { Res } from '@nestjs/common';

@Controller('mutelist')
export class MuteListController {
  constructor(private readonly muteListService: MuteListService) {}

  @Get(':channelid')
  async GetMutedUsers(@Param('channelid') channelid: number, @Res() res): Promise<User[]> {
    return res.send(await this.muteListService.GetMutedUsers(channelid));
  }

  @Get(':channelid/:userid')
  async CheckIfUserIsMuted(@Param('channelid') channelid: number, @Param('userid') userid: number, @Res() res): Promise<object> {
    return res.send(await this.muteListService.CheckIfUserIsMuted(channelid, userid));
  }

  @Post('mute')
  async MuteUserInChannel(@Body() payload: { callinguserid: number, channelid: number, userid: number }, @Res() res): Promise<Mutelist> {
    const { callinguserid, channelid, userid } = payload;
    return res.send(await this.muteListService.MuteUserInChannel(callinguserid, channelid, userid));
  }

  @Post('unmute')
  async UnMuteUserInChannel(@Body() payload: { callinguserid: number, channelid: number, userid: number }, @Res() res): Promise<Mutelist> {
    const { callinguserid, channelid, userid } = payload;
    return res.send(await this.muteListService.UnMuteUserInChannel(callinguserid, channelid, userid));
  }
}
