import { Controller,Post, Get, Param, Req, UseGuards,Res } from '@nestjs/common';
import { Request } from 'express';
import { googleOauthHandler } from './auth.handler';
import { UsersService } from '../Users/user.service';
import { AddUsersService } from '../AddUser/addUser.service';
import { log } from 'console';


@Controller('auth')
export class Ft_AuthController {
  constructor(private userService: UsersService, private addUserService: AddUsersService) {}

  @Post('42/login')
  async handleLogin(@Req() req:Request, @Res() res) 
  {
    console.log("mtavvvvv");
    
    res.header('Access-Control-Allow-Origin', '*');
      try {
        //console.log(req.body);
        
        // Process your request and create the response object
        const responseObject = {
          message: 'Login successful',
          data: req.body,
        };

        // Send the response object back to the client
        console.log("------------------------------------------");
        
        console.log(req.body.params.id);
        console.log("------------------------------------------");
        
        const is_user = await this.userService.findOneById(req.body.params.id);
        await console.log("fiiinddd",is_user);
        console.log(!is_user,is_user == null);
        
        if(!is_user)
        {
          
          const user = await this.addUserService.create({
              ID_42:req.body.params.id,
            displayName: req.body.params.displayname,
            avatarUrl: req.body.params.image.link,
            email:req.body.params.email,
          isTwoFactorEnabled: false,
          wins: 0,
           losses: 0
          })
          console.log("ussssserrr",user);
          
          return res.status(208).send(user);
        }

   
        console.log("ssssss",is_user);
        
        return res.send(is_user);
      } catch (error) {
        // Handle any errors that occur during the processing
        // and send an error response back to the client
        return ({ error: error });
      }
  }
    //@UseGuards(GoogleAuthGuard)
  

  // api/auth/google/redirect
  @Get('42/redirect')
  handleRedirect(@Req() req ,@Res() res) {
    googleOauthHandler(req,res)
    res.header('Access-Control-Allow-Origin', '*');
    console.log("done!");
    
    // console.log("request :",req.query);
    
    return { data: 'OK' };
    //@UseGuards(GoogleAuthGuard)
  }

  @Get('status')
  user(@Req() request: Request) {
   // console.log(request.user);
    if (request.user) {
      return { msg: 'Authenticated' };
    } else {
      return { msg: 'Not Authenticated' };
    }
  }
}
