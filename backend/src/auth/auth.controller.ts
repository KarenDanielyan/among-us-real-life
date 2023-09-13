import { Controller,Post, Get, Param, Req, UseGuards,Res,Body } from '@nestjs/common';
import { Request } from 'express';
import { googleOauthHandler } from './auth.handler';
import { UsersService } from '../Users/user.service';
import { AddUsersService } from '../AddUser/addUser.service';
import { use } from 'passport';

@Controller('auth')
export class AuthController {
  constructor(private userService: UsersService, private addUserService: AddUsersService) {
    
  }

  @Post('google/login')
  async handleLogin(@Req() req:Request, @Res() res,@Body() body:any) 
  { 
    console.clear()
    console.log("fffffffdsfsvfsf");
    
    // console.log("BODY:", body)
    res.header('Access-Control-Allow-Origin', '*');
        console.log("========================");
        
        console.log(body.id);
        console.log("========================");

        // try {
          
        // } catch (error) {
          
        // }
        
        const is_user = await this.userService.findOneById(body.id);
        await console.log("fiiinddd",is_user);
        console.log(!is_user,is_user == null);
        if(!is_user)
        {
          const user = await this.addUserService.create({
            ID_42:body.id,
            displayName: body.name,
            avatarUrl: body.picture,
            email:body.email,
            isTwoFactorEnabled: false,
            wins: 0,
            losses: 0
          })
          return res.status(208).send(user);
        }
        return res.status(201).send(is_user)
        
  }
    //@UseGuards(GoogleAuthGuard)
  

  // api/auth/google/redirect
  @Get('google/redirect')
  async handleRedirect(@Req() req ,@Res() res) {
    console.log(";;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;");

    res.header('Access-Control-Allow-Origin', '*');
    const user  = await googleOauthHandler(req,res)
    console.log("done!");
    console.log(await user);
    return res.status(206).send(await user)
    // console.log("request :",req.query);
    
    //return { msg: 'OK' };
    //@UseGuards(GoogleAuthGuard)
  }

  @Get('status')
  user(@Req() request: Request) {
    console.log(request.user);
    if (request.user) {
      return { msg: 'Authenticated' };
    } else {
      return { msg: 'Not Authenticated' };
    }
  }
}
