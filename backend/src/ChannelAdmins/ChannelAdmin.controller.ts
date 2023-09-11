import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ChannelAdminsService } from './ChannelAdmins.service'; 
import { ChannelAdmin } from './ChannelAdmin.entity';
import { ChannelAdminModel } from './ChannelAdminModel';
import { Res } from '@nestjs/common/decorators';

@Controller('channeladmins')
export class ChannelAdminsController {
  constructor(private readonly channelAdminsService: ChannelAdminsService) {}

  @Get('/:id/:userid')
  async getChannelAdmins(@Param('id') id: number, @Param('userid') userid: number, @Res() res): Promise<ChannelAdminModel[]> {
    return res.send(await this.channelAdminsService.getChannelAdmins(id, userid));
  }

  @Post()
  async addAdminToChannel(@Body() payload: { userid: number, channelid: number, adminid: number }, @Res() res): Promise<ChannelAdmin> {
    const { userid, channelid, adminid } = payload;
    return res.send(await this.channelAdminsService.addAdmin(userid, channelid, adminid));
  }

  @Delete('/:callinguserid/:channelid/:userid')
  async removeAdminFromChannel(@Param('callinguserid') callinguserid: number, @Param('channelid') channelid: number, @Param('userid') userid: number, @Res() res): Promise<void> {
    return res.send(await this.channelAdminsService.removeAdmin(callinguserid, channelid, userid));
  }
}