import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ChannelAdmin } from "../ChannelAdmins/ChannelAdmin.entity";
import { Channelmessage } from "../ChannelMessages/ChannelMessage.entity";
import { Channel } from "../Channels/Channel.entity";
import { ChannelUser } from "../ChannelUsers/ChannelUser.entity";
import { Gamehistory } from "../GameHistory/GameHistory.entity";
import { Mutelist } from "../MuteList/MuteList.entity";
import { UserFriend } from "../UserFriend/UserFriend.entity";
import { Directmessage } from "../DirectMessages/DirectMessage.entity";

export enum UserStatus {
  ONLINE,
  OFFLINE,
  INGAME,
}

@Index("users_pkey", ["id"], { unique: true })
@Index("users_42Id_key", ["id_42"], { unique: true })
@Entity("users", { schema: "public" })
export class User {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("numeric", { name: "id_42", nullable: true, unique: true })
  id_42: number | null;

  @Column("character varying", {
    name: "displayname",
    nullable: true,
    unique: false,
    length: 50,
  })
  displayname: string | null;

  @Column("character varying", {
    name: "email",
    nullable: true,
    unique: true,
    length: 50,
  })
  email: string | null;

  @Column("character varying", {
    name: "twofactoremail",
    nullable: true,
    unique: true,
    length: 50,
  })
  twofactoremail: string | null;

  @Column({
    type: "enum",
    enum: UserStatus,
    default: UserStatus.OFFLINE,
    nullable: true,
  })
  status: UserStatus;

  @Column("text", { name: "avatarurl", nullable: true })
  avatarurl: string | null;

  @Column("boolean", { name: "isverified", nullable: true })
  isverified: boolean | null;

  @Column("boolean", { name: "istwofactorenabled", nullable: true })
  istwofactorenabled: boolean | null;

  @Column("integer", { name: "wins", nullable: true })
  wins: number | null;

  @Column("integer", { name: "losses", nullable: true })
  losses: number | null;

  @OneToMany(() => ChannelAdmin, (channeladmins) => channeladmins.admin)
  channeladmins: ChannelAdmin[];

  @OneToMany(() => Channelmessage, (channelmessages) => channelmessages.user)
  channelmessages: Channelmessage[];

  @OneToMany(() => Directmessage, (directmessages) => directmessages.user1)
  directmessages: Directmessage[];

  @OneToMany(() => Channel, (channels) => channels.owner)
  channels: Channel[];

  @OneToMany(() => ChannelUser, (channelusers) => channelusers.user)
  channelusers: ChannelUser[];

  @OneToMany(() => Gamehistory, (gamehistory) => gamehistory.user)
  gamehistories: Gamehistory[];

  @OneToMany(() => Gamehistory, (gamehistory) => gamehistory.user2)
  gamehistories2: Gamehistory[];

  @OneToMany(() => Mutelist, (mutelist) => mutelist.user)
  mutelists: Mutelist[];

  @OneToMany(() => UserFriend, (userfriends) => userfriends.friend)
  userfriends: UserFriend[];

  @OneToMany(() => UserFriend, (userfriends) => userfriends.user)
  userfriends2: UserFriend[];
}
