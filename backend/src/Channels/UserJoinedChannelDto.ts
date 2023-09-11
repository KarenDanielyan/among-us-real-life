import { Channel } from './Channel.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UserJoinedChannelDto {
    @ApiProperty()
    channel: Channel
    @ApiProperty()
    role: ChannelRole
} 

export enum ChannelRole {
    OWNER,
    ADMIN,
    USER
}