import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channel } from '../Channels/Channel.entity'
import { ChannelMessagesController } from './ChannelMessages.controller';
import { ChannelMessagesService } from './ChannelMessages.service';
import { User } from '../Users/user.entity';
import { Channelmessage } from './ChannelMessage.entity';
import { ChannelUser } from '../ChannelUsers/ChannelUser.entity';
import { ChannelAdmin } from '../ChannelAdmins/ChannelAdmin.entity';
import { Mutelist } from '../MuteList/MuteList.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Channel, Channelmessage, ChannelUser, ChannelAdmin, Mutelist])],
  controllers: [ChannelMessagesController],
  providers: [ChannelMessagesService],
  exports: [ChannelMessagesService]
})
export class ChannelMessagesModule {}
