import { ApiProperty } from "@nestjs/swagger";

export class UpdateScoresDto {
    @ApiProperty()
    user1Score: number;
    @ApiProperty()
    user2Score: number;
}