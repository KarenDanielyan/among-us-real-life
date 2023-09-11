import { Controller, Get, Param } from '@nestjs/common';
import { Res } from '@nestjs/common';
import * as path from 'path';

@Controller("img")
export class ImageController {
  constructor() {}
  @Get('/:image')
  async getImage(@Param('image') image: string, @Res() res) {
    const imagePath = path.resolve(__dirname, '..', '..', 'photos', image);
    return res.sendFile(imagePath);
  }
}