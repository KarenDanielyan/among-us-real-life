import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ChannelUsersController } from './ChannelUser.controller';
import { ChannelUsersService } from './ChannelUsers.service';
import { ChannelUser } from './ChannelUser.entity';
import { ChannelAdmin } from '../ChannelAdmins/ChannelAdmin.entity';
import { Channel } from '../Channels/Channel.entity';
import { ChannelsService } from '../Channels/Channels.service';
import { UsersService } from '../Users/user.service';
import { User } from '../Users/user.entity';
import { Channelmessage } from '../ChannelMessages/ChannelMessage.entity';
import { Mutelist } from '../MuteList/MuteList.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ChannelUser, ChannelAdmin, Channel, User, Channelmessage, Mutelist])],
    controllers: [ChannelUsersController],
    providers: [ChannelUsersService, ChannelsService, UsersService],
    exports: [ChannelUsersService]
})
export class ChannelUsersModule {}