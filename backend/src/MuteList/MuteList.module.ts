import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mutelist } from './MuteList.entity';
import { User } from '../Users/user.entity';
import { MuteListController } from './MuteList.controller';
import { Channel } from '../Channels/Channel.entity';
import { ChannelUser } from '../ChannelUsers/ChannelUser.entity';
import { ChannelAdmin } from '../ChannelAdmins/ChannelAdmin.entity';
import { MuteListService } from './MuteList.service';
import { ChannelsService } from '../Channels/Channels.service';
import { UsersService } from '../Users/user.service';
import { Channelmessage } from '../ChannelMessages/ChannelMessage.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Channel, Mutelist, ChannelAdmin, ChannelUser, Channelmessage])],
  controllers: [MuteListController],
  providers: [MuteListService, ChannelsService, UsersService],
  exports: [MuteListService]
})
export class MuteListModule {}
