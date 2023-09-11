import { Controller, Get } from '@nestjs/common';
import { UserService } from './db.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll() {
    // const users = await this.userService.getData();
    return "nothing yet";
  }
}