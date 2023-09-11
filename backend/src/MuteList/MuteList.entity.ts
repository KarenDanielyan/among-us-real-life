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
  
  @Index("mutelist_pkey", ["id"], { unique: true })
  @Entity("mutelist", { schema: "public" })
  export class Mutelist {
    @PrimaryGeneratedColumn({ type: "integer", name: "id" })
    id: number;
  
    @Column("timestamp without time zone", { name: "muteddate", nullable: true })
    muteddate: Date | null;

    @Column("integer", { name: "channelid", nullable: true, unique: true })
    channelid: number | null;
  
    @Column("integer", { name: "userid", nullable: true, unique: true })
    userid: number | null;
  
    @ManyToOne(() => Channel, (channels) => channels.mutelists)
    @JoinColumn([{ name: "channelid", referencedColumnName: "id" }])
    channel: Channel;
  
    @ManyToOne(() => User, (users) => users.mutelists)
    @JoinColumn([{ name: "userid", referencedColumnName: "id" }])
    user: User;
  }
  