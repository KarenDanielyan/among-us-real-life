import { User } from '../Users/user.entity'
import { ApiProperty } from '@nestjs/swagger';

export class AddDirectMessageDto {
    @ApiProperty()
    user1: User;
    @ApiProperty()
    user2: User;
    @ApiProperty()
    id1:number;
    @ApiProperty()
    id2:number;
    @ApiProperty()
    message: string
}  