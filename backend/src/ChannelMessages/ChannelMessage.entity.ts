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
  
  @Index("channelmessages_pkey", ["id"], { unique: true })
  @Entity("channelmessages", { schema: "public" })
  export class Channelmessage {
    @PrimaryGeneratedColumn({ type: "integer", name: "id" })
    id: number;
  
    @Column("text", { name: "message", nullable: true })
    message: string | null;
  
    @Column("timestamp without time zone", {
      name: "publishdate",
      nullable: true,
    })
    publishdate: Date | null;
    
    @Column("integer", { name: "channelid", nullable: true, unique: true })
    channelid: number | null;

    @ManyToOne(() => Channel, (channels) => channels.channelmessages)
    @JoinColumn([{ name: "channelid", referencedColumnName: "id" }])
    channel: Channel;
  
    @ManyToOne(() => User, (users) => users.channelmessages)
    @JoinColumn([{ name: "userid", referencedColumnName: "id" }])
    user: User;
  }
  