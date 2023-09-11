import { User } from '../Users/user.entity'
import { Channel } from '../Channels/Channel.entity';
import { ApiProperty } from '@nestjs/swagger';

export class AddChannelMessageDto {
    @ApiProperty()
    channel: Channel;
    @ApiProperty()
    user: User;
    @ApiProperty()
    message: string
}  