import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mutelist } from './MuteList.entity';
import { Channel } from '../Channels/Channel.entity';
import { ChannelUser } from '../ChannelUsers/ChannelUser.entity';
import { ChannelAdmin } from '../ChannelAdmins/ChannelAdmin.entity';
import { ForbiddenException, BadRequestException } from '@nestjs/common/exceptions';
import { User } from '../Users/user.entity';
import { UsersService } from '../Users/user.service';
import { ChannelsService } from '../Channels/Channels.service';

@Injectable()
export class MuteListService {
  constructor(
    @InjectRepository(Mutelist)
    private muteListRepository: Repository<Mutelist>,
    @InjectRepository(ChannelUser)
    private channelUsersRepository: Repository<ChannelUser>,
    @InjectRepository(ChannelAdmin)
    private channelAdminsRepository: Repository<ChannelAdmin>,
    @InjectRepository(Channel)
    private channelsRepository: Repository<Channel>,
    private readonly usersService: UsersService,
    private readonly channelsService: ChannelsService
  ) {}

  async GetMutedUsers(channelid: number): Promise<User[]> {
    return (await this.muteListRepository.find({ where: { channelid: channelid }, relations: ['user'] })).map(m => m.user);
  }

  async CheckIfUserIsMuted(channelid: number, userid: number): Promise<object> {
    return { muted: await this.muteListRepository.exist({ where: { channelid: channelid, userid: userid } }) };
  }

  async MuteUserInChannel(callinguserid: number, channelid: number, userid: number): Promise<Mutelist> {
    await this.checkPermissions(callinguserid, channelid, userid);
    const mutedUser = new Mutelist();
    mutedUser.channelid = channelid;
    mutedUser.userid = userid;
    mutedUser.muteddate = new Date();
    return await this.muteListRepository.save(mutedUser);
  }

  async UnMuteUserInChannel(callinguserid: number, channelid: number, userid: number): Promise<Mutelist> {
    await this.checkPermissions(callinguserid, channelid, userid);
    const mutedUser = await this.muteListRepository.findOne({ where: { channelid: channelid, userid: userid } });
    if (!mutedUser)
    {
        throw new BadRequestException('User is not muted');
    }
    return await this.muteListRepository.remove(mutedUser);
  }

  private async checkPermissions(callinguserid: number, channelid: number, userid: number): Promise<boolean> {
    await this.usersService.findOneByPKId(callinguserid);
    await this.usersService.findOneByPKId(userid);
    var channel = await this.channelsService.getChannelById(channelid);
    var owner = (await this.channelsRepository.findOne({ relations: ['owner'], where: { id: channelid } })).owner;
    var admin = await this.channelAdminsRepository.findOne({ where: { channelid: channel.id, adminid: callinguserid } });
    if (!admin && owner.id != callinguserid)
    {
      throw new ForbiddenException('You do not have access to mute users in this channel.');
    }

    if (userid == owner.id)
    {
      throw new BadRequestException("Owner can't be muted in channel");
    }

    var user = await this.channelUsersRepository.findOne({ where: { channelid: channelid, userid: userid } });
    var adminUser = await this.channelAdminsRepository.findOne({ where: { channelid: channelid, adminid: userid } });
    if (!user && !adminUser)
    {
      throw new BadRequestException("User is not in channel");
    }

    if (admin && adminUser)
    {
      throw new BadRequestException("Only owner can mute admins in channel");
    }
    return true;
  }
}
