import { User } from '../Users/user.entity'
import { ApiProperty } from '@nestjs/swagger';

export class CreateChannelDto {
    @ApiProperty()
    channelType: "1" | "2" | "3";
    @ApiProperty()
    channelName: string;
    @ApiProperty()
    owner: User;
    @ApiProperty()
    password: string;
}  