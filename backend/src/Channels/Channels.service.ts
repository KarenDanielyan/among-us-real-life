import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './Channel.entity';
import { CreateChannelDto } from './CreateChannelDto';
import { In } from 'typeorm';
import { User } from '../Users/user.entity';
import { ChannelAdmin } from '../ChannelAdmins/ChannelAdmin.entity';
import { ChannelUser } from '../ChannelUsers/ChannelUser.entity';
import { JoinPublicChannelDto } from './JoinPublicChannelDto';
import { JoinProtectedChannelDto } from './JoinProtectedChannelDto';
import { NotFoundException } from '@nestjs/common';
import { BadRequestException, UnauthorizedException, ForbiddenException, InternalServerErrorException } from '@nestjs/common/exceptions';
import * as bcrypt from 'bcrypt';
import { ChannelRole, UserJoinedChannelDto } from './UserJoinedChannelDto';
import { ChannelUserDto } from '../ChannelUsers/ChannelUserDto';
import { Channelmessage } from '../ChannelMessages/ChannelMessage.entity';
import { Mutelist } from '../MuteList/MuteList.entity';

@Injectable()
export class ChannelsService {
  constructor(
    @InjectRepository(Channelmessage)
    private channelMsgRepository: Repository<Channelmessage>,
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    @InjectRepository(ChannelAdmin)
    private channelAdminsRepository: Repository<ChannelAdmin>,
    @InjectRepository(ChannelUser)
    private channelUsersRepository: Repository<ChannelUser>,
    @InjectRepository(Mutelist)
    private muteListRepository: Repository<Mutelist>
  ) {}

  async getAllChannels(): Promise<Channel[]> {
    return this.channelRepository.find({ where: { channeltype: In([1, 2]) }, relations: ['owner'], select: ["id", "channelname", "channeltype", "owner", "channelpictureurl"] });
  }

  async getChannelUsers(id: number): Promise<ChannelUserDto[]> {
    var ownerUser = (await this.getChannelOwner(id));
    var ownerModel = new ChannelUserDto();
    ownerModel.role = ChannelRole.OWNER;
    ownerModel.user = ownerUser;
    var admins = (await this.getChannelAdmins(id))
                            .map(ca =>
                            ({
                              role: ChannelRole.ADMIN,
                              user: ca
                            }));
    var users = (await this.channelUsersRepository.find({ where: { channelid: id }, relations: ['user'] }))
                                                  .map(cu => ({
                                                    role: ChannelRole.USER,
                                                    user: cu.user
                                                  }));
    return [ownerModel].concat(admins, users);
  }

  async getChannelOwner(id: number): Promise<User> {
    console.log(id);
    const c = await this.channelRepository.findOne({ where: { id: id }, relations: ['owner'] });
    console.log(c);
    return (await this.channelRepository.findOne({ where: { id: id }, relations: ['owner'] })).owner;
  }

  async getChannelAdmins(id: number): Promise<User[]> {
    return (await this.channelAdminsRepository.find({ where: { channelid: id }, relations: ['admin'] })).map(a => a.admin);
  } 

  async getChannelById(channelid: number): Promise<Channel> {
    var channel = await this.channelRepository.findOne({ where: { id: channelid }, relations: ["owner", "channelusers.user", "channeladmins.admin"], select: ["id", "channelname", "channeltype", "owner", "channelpictureurl"] });
    if (!channel)
      throw new NotFoundException("Channel not found");
    return channel;
  }

  async getUserChannels(userId: number): Promise<Channel[]> {
    return await this.channelRepository.find({ where: { owner: { id: userId } }, relations: ['owner'], select: ["id", "channelname", "channeltype", "owner", "channelpictureurl"] });
  }

  async getUserJoinedChannels(userId: number): Promise<UserJoinedChannelDto[]> {
    var ownedChannels = (await this.channelRepository.find({ where: { owner: { id: userId } }, relations: ["owner"],
                                                             select: ["id", "channelname", "channeltype", "owner", "channelpictureurl"] }))
                                                     .map(c => ({
                                                      role: ChannelRole.OWNER,
                                                      channel: c
                                                    }));
    var adminedChannels = (await this.channelAdminsRepository.find({ where: { adminid: userId }, relations: ["channel", "channel.owner"] }))
                                                             .map(ca => ({
                                                              role: ChannelRole.ADMIN,
                                                              channel: ca.channel
                                                             }));
    var regularChannels = (await this.channelUsersRepository.find({ where: { userid: userId }, relations: ["channel", "channel.owner"] }))
                                                            .map(cu => ({
                                                              role: ChannelRole.USER,
                                                              channel: cu.channel
                                                            }));
    var result = ownedChannels.concat(adminedChannels, regularChannels);
    result.forEach(uc => uc.channel.password = null);
    return result;
  }

  async createChannel(createChannelDto: CreateChannelDto): Promise<Channel> {
    if (createChannelDto.channelType == "2" && (!createChannelDto.password || createChannelDto.password == ''))
    {
      throw new BadRequestException("You must provide a password");
    }
    if (createChannelDto.channelType != "2" && (createChannelDto.password && createChannelDto.password != ''))
    {
      throw new BadRequestException("You can't set a password on public or invite-only channels");
    }
    if (createChannelDto.channelName == '' || !createChannelDto.channelName)
    {
      throw new BadRequestException("You must provide channel name");
    }
    if (!createChannelDto.owner)
    {
      throw new BadRequestException("Owner object can't be null");
    }
    const channel = new Channel();
    channel.channeltype = createChannelDto.channelType;
    channel.channelname = createChannelDto.channelName;
    channel.owner = createChannelDto.owner;
    channel.password = createChannelDto.channelType == "2" ? await bcrypt.hash(createChannelDto.password, 10) : null;
    var r = await this.channelRepository.save(channel);
    r.password = null;
    return r;
  }

  async joinUserToPublicChannel(joinPublicChannelDto: JoinPublicChannelDto): Promise<ChannelUser> {
    const channelUser = new ChannelUser();
    channelUser.userid = joinPublicChannelDto.userid;
    channelUser.channelid = joinPublicChannelDto.channelid;
    return await this.channelUsersRepository.save(channelUser);
  }

  async joinUserToProtectedChannel(joinProtectedChannelDto: JoinProtectedChannelDto): Promise<ChannelUser> {
    const channel = await this.channelRepository.findOne({ where: { id: joinProtectedChannelDto.channelid, channeltype: "2" } });
    if (!channel) {
      throw new NotFoundException('Channel not found');
    }

    const passwordMatched = await bcrypt.compare(joinProtectedChannelDto.password, channel.password);
    if (!passwordMatched) {
      throw new UnauthorizedException('Incorrect password');
    }

    const channelUser = new ChannelUser();
    channelUser.userid = joinProtectedChannelDto.userid;
    channelUser.channelid = joinProtectedChannelDto.channelid;
    return await this.channelUsersRepository.save(channelUser);
  }

  async deleteChannel(userid: number, channelid: number): Promise<void> {
    if ((await this.getChannelOwner(channelid)).id == userid)
    {
      await this.channelAdminsRepository.delete({ channelid: channelid });
      await this.channelUsersRepository.delete({ channelid: channelid });
      await this.channelMsgRepository.delete({ channelid: channelid });
      await this.muteListRepository.delete({ channelid: channelid });
      await this.channelRepository.delete({ id: channelid });
    }
    else
    {
      throw new ForbiddenException('Only channel owner can delete the channel');
    }
  }

  async leaveChannel(userid: number, channelid: number): Promise<void> {
    var users = await this.getChannelUsers(channelid);
    const member = users.find((cu) => cu.user.id === userid);
    if (!member)
    {
      throw new BadRequestException("User is not in channel");
    }
    if (member.role == ChannelRole.USER)
    {
      await this.channelUsersRepository.delete({ channelid: channelid, userid: userid });
      return;
    }
    else if (member.role == ChannelRole.ADMIN)
    {
      await this.channelAdminsRepository.delete({ channelid: channelid, adminid: userid });
      return;
    }
    else
    {
      const admins = users.filter((cu) => cu.role === ChannelRole.ADMIN);
      if (admins.length > 0)
      {
        const newOwner = admins[0].user;
        await this.channelAdminsRepository.delete({ channelid: channelid, adminid: newOwner.id });
        if ((await this.channelRepository.update(channelid, { owner: newOwner })).affected == 0)
        {
          throw new InternalServerErrorException();
        }
        return;
      }

      const usersInChannel = users.filter((cu) => cu.role === ChannelRole.USER);
      if (usersInChannel.length > 0)
      {
        const newOwner = usersInChannel[0].user;
        await this.channelUsersRepository.delete({ channelid: channelid, userid: newOwner.id });
        if ((await this.channelRepository.update(channelid, { owner: newOwner })).affected == 0)
        {
          throw new InternalServerErrorException();
        }
        return;
      }
      else
      {
        await this.channelAdminsRepository.delete({ channelid: channelid });
        await this.channelUsersRepository.delete({ channelid: channelid });
        await this.channelMsgRepository.delete({ channelid: channelid });
        await this.channelRepository.delete({ id: channelid });
      }
    }
  }

  async updateChannelInfo(channel: Channel): Promise<Channel> {
    return await this.channelRepository.save(channel);
  }
}
