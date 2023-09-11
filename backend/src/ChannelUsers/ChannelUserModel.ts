import { User } from "../Users/user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class ChannelUserModel {
    @ApiProperty()
    id: number
    @ApiProperty()
    channelid: number
    @ApiProperty()
    user: User
}