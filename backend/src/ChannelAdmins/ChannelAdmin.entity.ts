import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from "typeorm";
  import { User } from "../Users/user.entity";
  import { Channel } from "../Channels/Channel.entity";
  
  @Index("unique_channel_admin_pair", ["adminid", "channelid"], { unique: true })
  @Index("channeladmins_pkey", ["id"], { unique: true })
  @Entity("channeladmins", { schema: "public" })
  export class ChannelAdmin {
    @PrimaryGeneratedColumn({ type: "integer", name: "id" })
    id: number;
  
    @Column("integer", { name: "channelid", nullable: true, unique: true })
    channelid: number | null;
  
    @Column("integer", { name: "adminid", nullable: true, unique: true })
    adminid: number | null;
  
    @ManyToOne(() => User, (users) => users.channeladmins)
    @JoinColumn([{ name: "adminid", referencedColumnName: "id" }])
    admin: User;
  
    @ManyToOne(() => Channel, (channels) => channels.channeladmins)
    @JoinColumn([{ name: "channelid", referencedColumnName: "id" }])
    channel: Channel;
  }
  