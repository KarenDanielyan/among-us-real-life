import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from "typeorm";
  import { Channel } from "../Channels/Channel.entity";
  import { User } from "../Users/user.entity";
  
  @Index("unique_channel_user_pair", ["channelid", "userid"], { unique: true })
  @Index("channelusers_pkey", ["id"], { unique: true })
  @Entity("channelusers", { schema: "public" })
  export class ChannelUser {
    @PrimaryGeneratedColumn({ type: "integer", name: "id" })
    id: number;
  
    @Column("integer", { name: "channelid", nullable: true, unique: true })
    channelid: number | null;
  
    @Column("integer", { name: "userid", nullable: true, unique: true })
    userid: number | null;
  
    @ManyToOne(() => Channel, (channels) => channels.channelusers)
    @JoinColumn([{ name: "channelid", referencedColumnName: "id" }])
    channel: Channel;
  
    @ManyToOne(() => User, (users) => users.channelusers)
    @JoinColumn([{ name: "userid", referencedColumnName: "id" }])
    user: User;
  }
  