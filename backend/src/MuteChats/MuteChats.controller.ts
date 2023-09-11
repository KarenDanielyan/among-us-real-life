import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { Res } from '@nestjs/common';
import { Mutechat } from './MuteChat.entity';
import { MuteChatsService } from './MuteChats.service';

@Controller('mutechats')
export class MuteChatsController {
  constructor(private readonly muteChatsService: MuteChatsService) {}

  @Get('/:userid/:checkuserid')
  async CheckMute(@Param('userid') userid: number, @Param('checkuserid') checkuserid: number, @Res() res): Promise<object> {
    return res.send(await this.muteChatsService.CheckMuteStatus(userid, checkuserid));
  }

  @Post('mute')
  async MuteUser(@Body() payload: { callinguserid: number, userid: number }, @Res() res): Promise<Mutechat> {
    const { callinguserid, userid } = payload;
    return res.send(await this.muteChatsService.MuteUser(callinguserid, userid));
  }

  @Post('unmute')
  async UnMuteUser(@Body() payload: { callinguserid: number, userid: number }, @Res() res): Promise<Mutechat> {
    const { callinguserid, userid } = payload;
    return res.send(await this.muteChatsService.UnMuteUser(callinguserid, userid));
  }
}