import { User } from "../Users/user.entity";
import { ApiProperty } from "@nestjs/swagger";

export class ChannelAdminModel {
    @ApiProperty()
    id: number
    @ApiProperty()
    channelid: number
    @ApiProperty()
    admin: User
}