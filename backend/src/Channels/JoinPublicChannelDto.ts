import { ApiProperty } from "@nestjs/swagger";

export class JoinPublicChannelDto {
    @ApiProperty()
    userid: number;
    @ApiProperty()
    channelid: number;
}  