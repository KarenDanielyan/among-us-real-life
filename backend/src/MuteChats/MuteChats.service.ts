import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mutechat } from './MuteChat.entity';

@Injectable()
export class MuteChatsService {
  constructor(
    @InjectRepository(Mutechat)
    private muteChatsRepository: Repository<Mutechat>
  ) {}

  async CheckMuteStatus(userid: number, checkuserid: number): Promise<object> {
    if (!userid || !checkuserid)
    {
      throw new BadRequestException("Invalid parameters");
    }
    return { muted: await this.muteChatsRepository.exist({ where: { userid: userid, muteduserid: checkuserid } }) };
  }

  async MuteUser(callinguserid: number, userid: number): Promise<Mutechat> {
    if (!callinguserid || !userid)
    {
        throw new BadRequestException("Invalid parameters");
    }
    if (callinguserid == userid)
    {
        throw new BadRequestException("You can not mute yourself");
    }
    var mutedchat = await this.muteChatsRepository.findOne({ where: { userid: callinguserid, muteduserid: userid } });
    if (mutedchat)
    {
        throw new BadRequestException("The specified user is already muted");
    }
    var mutedchat = new Mutechat();
    mutedchat.userid = callinguserid;
    mutedchat.muteduserid = userid;
    return await this.muteChatsRepository.save(mutedchat);
  }

  async UnMuteUser(callinguserid: number, userid: number): Promise<Mutechat> {
    if (!callinguserid || !userid)
    {
        throw new BadRequestException("Invalid parameters");
    }
    var mutedchat = await this.muteChatsRepository.findOne({ where: { userid: callinguserid, muteduserid: userid } });
    if (!mutedchat)
    {
        throw new BadRequestException("The specified user is not muted");
    }
    return await this.muteChatsRepository.remove(mutedchat);
  }
}