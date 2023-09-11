import { User } from '../Users/user.entity'
import { ApiProperty } from '@nestjs/swagger';

export class CreateGameDto {
    @ApiProperty()
    user1: User;
    @ApiProperty()
    user2: User;
    @ApiProperty()
    user1Score: number;
    @ApiProperty()
    user2Score: number
}  