import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Directmessage } from './DirectMessage.entity';
import { AddDirectMessageDto } from './AddDirectMessageDto';
import { User } from '../Users/user.entity';
import { DirectMessageDto } from './DirectMessageDto';
import { Mutechat } from '../MuteChats/MuteChat.entity';

@Injectable()
export class DirectMessagesService {
  constructor(
    @InjectRepository(Directmessage)
    private directMessagesRepository: Repository<Directmessage>,
    @InjectRepository(Mutechat)
    private muteChatsRepository: Repository<Mutechat>
  ) {}

  async addDirectMessage(addDirectMessageDto: AddDirectMessageDto): Promise<Directmessage> {
    const directmessage = new Directmessage();
    directmessage.message = addDirectMessageDto.message;
    directmessage.user1 = addDirectMessageDto.user1;
    directmessage.user2 = addDirectMessageDto.user2;
    directmessage.user1id = addDirectMessageDto.id1;
    directmessage.user2id = addDirectMessageDto.id2;
    directmessage.publishdate = new Date();
    directmessage.hidden = false;
    if (await this.muteChatsRepository.exist({ where: { userid: addDirectMessageDto.id2, muteduserid: addDirectMessageDto.id1 } }))
    {
      directmessage.hidden = true;
    }
    return await this.directMessagesRepository.save(directmessage);
  }

  async getUserAllChats(userid: number): Promise<User[]> {
    var dmusers = (await this.directMessagesRepository.find({ where: [ {user1id: userid}, {user2id: userid } ], relations: ['user1', 'user2'], order: { id: 'DESC' } }));
    const users = dmusers.map(dm => {
      if (dm.user1id == userid)
        return dm.user2;
      else
        return dm.user1;
    });
    return [...new Map(users.map((item) => [item["id"], item])).values()];
  }

  async getChatMessages(user1id: number, user2id: number): Promise<DirectMessageDto[]> {
    return (await this.directMessagesRepository.find({ where: [
                                                    { user1id: user1id, user2id: user2id },
                                                    { user1id: user2id, user2id: user1id, hidden: false } ],
                                                    order: { id: 'ASC' } })).map(dm => ({
                                                                              senderid: dm.user1id,
                                                                              message: dm.message,
                                                                              publishdate: dm.publishdate
                                                                            }));
  }
}