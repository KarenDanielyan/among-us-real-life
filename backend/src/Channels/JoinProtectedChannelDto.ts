import { ApiProperty } from "@nestjs/swagger";

export class JoinProtectedChannelDto {
    @ApiProperty()
    userid: number;
    @ApiProperty()
    channelid: number;
    @ApiProperty()
    password: string;
}  