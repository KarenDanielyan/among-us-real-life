import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChannelAdmin } from './ChannelAdmin.entity';
import { ChannelAdminModel } from './ChannelAdminModel';
import { User } from '../Users/user.entity';
import { BadRequestException, ForbiddenException } from '@nestjs/common/exceptions';
import { ChannelUser } from '../ChannelUsers/ChannelUser.entity';

@Injectable()
export class ChannelAdminsService {
  constructor(
    @InjectRepository(ChannelAdmin)
    private channelAdminsRepository: Repository<ChannelAdmin>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(ChannelUser)
    private channelUsersRepository: Repository<ChannelUser>
  ) {}

  async getChannelAdmins(channelid: number, userid: number): Promise<ChannelAdminModel[]> {
    var user = await this.usersRepository.findOne({ relations: ['channels'], where: { id: userid } })
    if (!user || !user.channels.some(channel => channel.id == channelid)) {
      throw new ForbiddenException('You do not have access to view the admins of this channel.');
    }
    var channeladmins = await this.channelAdminsRepository.find({ relations: ['admin'], where: { channelid: channelid } });
    console.log(channeladmins);
    return channeladmins.map((ca) => ({
      id: ca.id,
      channelid: ca.channelid,
      admin: ca.admin
    }));
  }

  async addAdmin(userid: number, channelid: number, adminid: number): Promise<ChannelAdmin> {
    var user = await this.usersRepository.findOne({ relations: ['channels'], where: { id: userid } })
    if (!user || !user.channels.some(channel => channel.id == channelid)) {
      throw new ForbiddenException('You do not have access to add admins on this channel.');
    }

    var channeluser = await this.channelUsersRepository.findOne({ where: { channelid: channelid, userid: adminid } });
    if (!channeluser)
    {
      throw new BadRequestException("User is not in this channel");
    }
    const channelAdmin = new ChannelAdmin();
    channelAdmin.channelid = channelid;
    channelAdmin.adminid = adminid;
    await this.channelUsersRepository.remove(channeluser);
    return await this.channelAdminsRepository.save(channelAdmin);
  }

  async removeAdmin(callinguserid: number, channelid: number, userid: number): Promise<void> {
    var admin = (await this.channelAdminsRepository.findOne({ where: { channelid: channelid, adminid: userid } }));
    if (!admin)
    {
      throw new BadRequestException("Channel doesn't have such admin");
    }
    var user = await this.usersRepository.findOne({ relations: ['channels'], where: { id: callinguserid } })
    if (!user || !user.channels.some(channel => channel.id == channelid)) {
      throw new ForbiddenException('You do not have access to remove admins from this channel.');
    }
    await this.channelAdminsRepository.remove(admin);
  }
}
