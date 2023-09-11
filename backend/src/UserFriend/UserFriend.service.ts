import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserFriend } from './UserFriend.entity';
import { User } from '../Users/user.entity'; 
import { UserFriendModel } from './UserFriendModel';

@Injectable()
export class UserFriendService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(UserFriend)
        private friendRepository: Repository<UserFriend>,
      ) {}

      async getUserFriends(userId: number): Promise<UserFriendModel[]> {
        const userfriends = await this.friendRepository.find({ relations: ['friend'], where: { userid: userId }});
        console.log(userfriends)
        return userfriends.map((uf) => ({
          id: uf.id,
          user: uf.friend
        }));
      }

      async addFriend(userid: number, friendid: number): Promise<UserFriend> {
        const userFriend = new UserFriend();
        userFriend.userid = userid;
        userFriend.friendid = friendid;
        return await this.friendRepository.save(userFriend);
      }
    
      async removeFriend(userid: number, friendid: number): Promise<void> {
        await this.friendRepository.delete({ userid: userid, friendid: friendid });
      }
}