import { Controller, Post, Body, Res } from '@nestjs/common';
import { UserPinsService } from './Userpins.service';

@Controller('twofactor')
export class UserPinsController {
  constructor(private readonly userPinsService: UserPinsService) {}
  
  @Post('enable')
  async EnableTF(@Body() payload: { userid: number, email: string }, @Res() res): Promise<void> {
    const { userid, email } = payload;
    return res.send(await this.userPinsService.EnableTF(userid, email));
  }

  @Post('disable')
  async DisableTF(@Body() payload: { userid: number }, @Res() res): Promise<void> {
    const { userid } = payload;
    return res.send(await this.userPinsService.DisableTF(userid));
  }

  // @Post('set')
  // async MuteUserInChannel(@Body() payload: { userid: number, pin: string }, @Res() res): Promise<void> {
  //   const { userid, pin } = payload;
  //   return res.send(await this.userPinsService.SetPin(userid, pin));
  // }

  // @Post('change')
  // async ChangeUserPin(@Body() payload: { userid: number, oldpin: string, newpin: string }, @Res() res): Promise<void> {
  //   const { userid, oldpin, newpin } = payload;
  //   return res.send(await this.userPinsService.ChangePin(userid, oldpin, newpin));
  // }

  // @Post('remove')
  // async DeleteUserPin(@Body() payload: { userid: number, pin: string }, @Res() res): Promise<void> {
  //   const { userid, pin } = payload;
  //   return res.send(await this.userPinsService.DeletePin(userid, pin));
  // }

  @Post('check')
  async CheckUserPin(@Body() payload: { userid: number, pin: string }, @Res() res): Promise<object> {
    const { userid, pin } = payload;
    return res.send(await this.userPinsService.CheckPin(userid, pin));
  }
}
