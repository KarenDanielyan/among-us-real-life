import { ApiProperty } from "@nestjs/swagger"

export class DirectMessageDto {
    @ApiProperty()
    senderid: number
    @ApiProperty()
    message: string
    @ApiProperty()
    publishdate: Date
} 