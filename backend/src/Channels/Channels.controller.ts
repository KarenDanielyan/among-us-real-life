import { Controller, Get, Post, Delete, Param, Body, Res, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { Channel } from './Channel.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { ChannelsService } from './Channels.service'; 
import { CreateChannelDto } from './CreateChannelDto';
import { User } from '../Users/user.entity';
import { ChannelUser } from '../ChannelUsers/ChannelUser.entity';
import { JoinPublicChannelDto } from './JoinPublicChannelDto';
import { JoinProtectedChannelDto } from './JoinProtectedChannelDto';
import { UserJoinedChannelDto } from './UserJoinedChannelDto';
import { extname } from 'path';
import { ApiConsumes, ApiBody } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { ChannelUserDto } from '../ChannelUsers/ChannelUserDto';

@Controller('channels')
export class ChannelsController {
  constructor(private readonly channelService: ChannelsService) {}

  @Get('get/:id')
  async getChannelById(@Param('id') id: number, @Res() res): Promise<Channel> {
    return res.send(await this.channelService.getChannelById(id));
  }

  @Get('all')
  async getAllChannels(@Res() res): Promise<Channel[]> {
    return res.send(await this.channelService.getAllChannels());
  }
  
  @Get('owner/:id')
  async getChannelOwner(@Param('id') id: number, @Res() res): Promise<User> {
    return res.send(await this.channelService.getChannelOwner(id));
  }
  
  @Get('admins/:id')
  async getChannelAdmins(@Param('id') id: number, @Res() res): Promise<User[]> {
    return res.send(await this.channelService.getChannelAdmins(id));
  }
  
  @Get('users/:id')
  async getChannelUsersById(@Param('id') id: number, @Res() res): Promise<ChannelUserDto[]> {
    return res.send(await this.channelService.getChannelUsers(id));
  }
  
  @Get('user/:userId')
  async getUserChannels(@Param('userId') userId: number, @Res() res): Promise<Channel[]> {
    return res.send(await this.channelService.getUserChannels(userId));
  }

  @Get('user/all/:userId')
  async getUserJoinedChannels(@Param('userId') userId: number, @Res() res): Promise<UserJoinedChannelDto[]> {
    return res.send(await this.channelService.getUserJoinedChannels(userId));
  }
  
  @Post()
  async createChannel(@Body() createChannelDto: CreateChannelDto, @Res() res): Promise<Channel> {
    return res.send(await this.channelService.createChannel(createChannelDto));
  }
  
  @Post('join/public')
  async joinPublicChannel(@Body() joinPublicChannelDto: JoinPublicChannelDto, @Res() res): Promise<ChannelUser> {
    return res.send(await this.channelService.joinUserToPublicChannel(joinPublicChannelDto));
  }
  
  @Post('join/password')
  async joinProtectedChannel(@Body() joinProtectedChannelDto: JoinProtectedChannelDto, @Res() res): Promise<ChannelUser> {
    return res.send(await this.channelService.joinUserToProtectedChannel(joinProtectedChannelDto));
  }
  
  @Delete('/:userid/:channelid')
  async deleteChannel(@Param('userid') userid: number, @Param('channelid') channelid: number, @Res() res): Promise<void> {
    return res.send(await this.channelService.deleteChannel(userid, channelid));
  }

  @Post('leave')
  async leaveChannel(@Body() payload: { userid: number, channelid: number }, @Res() res): Promise<void> {
    const { userid, channelid } = payload;
    return res.send(await this.channelService.leaveChannel(userid, channelid));
  }

  @Post('picture')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
        channelid: {
          type: 'number',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './photos',
      filename: (req, file, callback) => {
        const uniqueName = uuid();
        const fileExtension = extname(file.originalname);
        callback(null, `${uniqueName}${fileExtension}`);
      },
    }),
  }))
  async uploadUserAvatar(@UploadedFile() file: Express.Multer.File, @Body() payload: { channelid: number }, @Res() res): Promise<any> {
    const { channelid } = payload;
    var channel = await this.channelService.getChannelById(channelid);
    if (!channel)
    {
      throw new BadRequestException("Channel not found!");
    }
    if (!file)
    {
      res.status(400).send('No avatar found in the request');
    }
    else
    {
      const pictureurl = `${process.env.IP}:7000/img/${file.filename}`;
      channel.channelpictureurl = pictureurl;
      this.channelService.updateChannelInfo(channel);
      res.status(200).send({ pictureurl });
    }
  }
}