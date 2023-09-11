import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ChannelAdminsController } from './ChannelAdmin.controller';
import { ChannelAdminsService } from './ChannelAdmins.service';
import { ChannelAdmin } from './ChannelAdmin.entity';
import { UsersModule } from '../Users/users.module';
import { User } from '../Users/user.entity';
import { ChannelUser } from '../ChannelUsers/ChannelUser.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ChannelAdmin, User, ChannelUser]), UsersModule],
    controllers: [ChannelAdminsController],
    providers: [ChannelAdminsService],
    exports: [ChannelAdminsService]
})
export class ChannelAdminsModule {}