import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channelmessage } from './ChannelMessage.entity';
import { AddChannelMessageDto } from './AddChannelMessageDto';
import { Channel } from '../Channels/Channel.entity';
import { ChannelAdmin } from '../ChannelAdmins/ChannelAdmin.entity';
import { ChannelUser } from '../ChannelUsers/ChannelUser.entity';
import { BadRequestException, ForbiddenException } from '@nestjs/common/exceptions';
import { Mutelist } from '../MuteList/MuteList.entity';

@Injectable()
export class ChannelMessagesService {
  constructor(
    @InjectRepository(Channelmessage)
    private channelMessagesRepository: Repository<Channelmessage>,
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
    @InjectRepository(ChannelAdmin)
    private channelAdminsRepository: Repository<ChannelAdmin>,
    @InjectRepository(ChannelUser)
    private channelUsersRepository: Repository<ChannelUser>,
    @InjectRepository(Mutelist)
    private muteListRepository: Repository<Mutelist>
  ) {}

  async getChannelMessages(id: number): Promise<Channelmessage[]> {
    return await this.channelMessagesRepository.find({ relations: ['user'], where: { channel: { id: id } }, order: { id: "ASC" } });
  }

  async addMessageToChannel(addMessageToChannelDto: AddChannelMessageDto): Promise<Channelmessage> {
    var owner = await this.channelRepository.findOne({ where: { owner: { id: addMessageToChannelDto.user.id } } });
    var admin = await this.channelAdminsRepository.findOne({ where: { channelid: addMessageToChannelDto.channel.id, adminid: addMessageToChannelDto.user.id } })
    var user = await this.channelUsersRepository.findOne({ where: { channelid: addMessageToChannelDto.channel.id, userid: addMessageToChannelDto.user.id } })
    if (!owner && !admin && !user)
    {
        throw new ForbiddenException('You do not have access to write message to this channel.');
    }
    if (await this.muteListRepository.findOne({ where: { channelid: addMessageToChannelDto.channel.id, userid: addMessageToChannelDto.user.id } }))
    {
       throw new ForbiddenException('You are muted, you are not allowed to write messages in this channel');
    }
    const channelmessage = new Channelmessage();
    channelmessage.message = addMessageToChannelDto.message;
    channelmessage.user = addMessageToChannelDto.user;
    channelmessage.channel = addMessageToChannelDto.channel;
    channelmessage.publishdate = new Date();
    return await this.channelMessagesRepository.save(channelmessage);
  }
}