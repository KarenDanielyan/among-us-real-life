import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../Users/user.entity';
import { Channel } from '../Channels/Channel.entity';
import { Channelmessage } from '../ChannelMessages/ChannelMessage.entity';
import { Mutechat } from './MuteChat.entity';
import { MuteChatsController } from './MuteChats.controller';
import { MuteChatsService } from './MuteChats.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Channel, Channelmessage, Mutechat])],
  controllers: [MuteChatsController],
  providers: [MuteChatsService],
  exports: [MuteChatsService]
})
export class MuteChatsModule {}
