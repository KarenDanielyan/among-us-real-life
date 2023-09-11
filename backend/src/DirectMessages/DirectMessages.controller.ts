import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { DirectMessagesService } from './DirectMessages.service';
import { Directmessage } from './DirectMessage.entity';
import { AddDirectMessageDto } from './AddDirectMessageDto';
import { User } from '../Users/user.entity';
import { DirectMessageDto } from './DirectMessageDto';
import { Res } from '@nestjs/common';

@Controller('directmessages')
export class DirectMessagesController {
  constructor(private readonly directMessagesService: DirectMessagesService) {}

  @Post()
  async addDirectMessage(@Body() addDirectMessageDto: AddDirectMessageDto, @Res() res): Promise<Directmessage> {
    return res.send(await this.directMessagesService.addDirectMessage(addDirectMessageDto));
  }

  @Get('chats/:userid')
  async getUserAllChats(@Param('userid') userid: number, @Res() res): Promise<User[]> {
    return res.send(await this.directMessagesService.getUserAllChats(userid));
  }

  @Get('messages/:user1id/:user2id')
  async getChatMessages(@Param('user1id') user1id: number, @Param('user2id') user2id: number, @Res() res): Promise<DirectMessageDto[]> {
    return res.send(await this.directMessagesService.getChatMessages(user1id, user2id));
  }
}