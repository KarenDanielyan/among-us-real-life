import { User } from '../Users/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ChannelRole } from '../Channels/UserJoinedChannelDto';

export class ChannelUserDto {
    @ApiProperty()
    role: ChannelRole
    @ApiProperty()
    user: User
}