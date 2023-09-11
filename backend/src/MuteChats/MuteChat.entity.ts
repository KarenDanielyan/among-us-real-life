import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from "typeorm";
import { User } from "../Users/user.entity";
  
@Index("unique_user__pair", ["muteduserid", "userid"], { unique: true })
  @Index("mutechats_pkey", ["id"], { unique: true })
  @Entity("mutechats", { schema: "public" })
  export class Mutechat {
    @PrimaryGeneratedColumn({ type: "integer", name: "id" })
    id: number;

    @Column("integer", { name: "userid", nullable: true, unique: true })
    userid: number | null;
  
    @Column("integer", { name: "muteduserid", nullable: true, unique: true })
    muteduserid: number | null;
  
    @ManyToOne(() => User, (users) => users.mutelists)
    @JoinColumn([{ name: "userid", referencedColumnName: "id" }])
    user: User;

    @ManyToOne(() => User, (users) => users.mutelists)
    @JoinColumn([{ name: "muteduserid", referencedColumnName: "id" }])
    muteduser: User;
  }