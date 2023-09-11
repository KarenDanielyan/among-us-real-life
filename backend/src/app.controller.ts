import { Controller, Get, Post, Body, Param,Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import * as requestIp from 'request-ip';
import * as path from 'path';
import { Response } from 'express';








@Controller("game")
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Post()
  create(@Body() userData: string): string {
    console.log(userData);
    return `Post request called with param #${userData}.`;
  }
  @Get()
  gameGet(): string {
    return `Get request.`;
  }
  @Get("/login")
  login(): string {
    return this.appService.getHello();
  }
  @Get("/ip")
  getCurrentIp(@Req() request: Request): string {
    const ip = requestIp.getClientIp(request);
    return ip;
  }

  @Get('img/:path')
  sendImage(@Param('path') pathh: string, @Res() res: Response) {
    const imagePath = path.resolve(__dirname, '..', 'photos', pathh);
    // const imagePath = join('42\\ft_transendence\\backend\\','photos', path);
    console.log("+++++++++++++++++++++++++++++++");
    console.log(__dirname,__filename);
    console.log("+++++++++++++++++++++++++++++++");
    return res.sendFile(imagePath);
  }
}