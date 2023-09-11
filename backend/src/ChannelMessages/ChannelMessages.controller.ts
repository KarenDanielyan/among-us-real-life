import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { Channelmessage } from './ChannelMessage.entity';
import { ChannelMessagesService } from './ChannelMessages.service'; 
import { AddChannelMessageDto } from './AddChannelMessageDto';
import { Res } from '@nestjs/common';

@Controller('channelmessages')
export class ChannelMessagesController {
  constructor(private readonly channelMessagesService: ChannelMessagesService) {}

  @Get(':id')
  async getChannelMessages(@Param('id') id: number, @Res() res): Promise<Channelmessage[]> {
    return res.send(await this.channelMessagesService.getChannelMessages(id));
  }

  @Post()
  async addMessageToChannel(@Body() addChannelMessageDto: AddChannelMessageDto, @Res() res): Promise<Channelmessage> {
    return res.send(await this.channelMessagesService.addMessageToChannel(addChannelMessageDto));
  }
}