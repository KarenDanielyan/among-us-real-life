import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from "typeorm";
  import { User } from "../Users/user.entity";
  
  @Index("directmessages_pkey", ["id"], { unique: true })
  @Entity("directmessages", { schema: "public" })
  export class Directmessage {
    @PrimaryGeneratedColumn({ type: "integer", name: "id" })
    id: number;
  
    @Column("text", { name: "message", nullable: true })
    message: string | null;
  
    @Column("timestamp without time zone", {
      name: "publishdate",
      nullable: true,
    })
    publishdate: Date | null;

    @Column("boolean", { name: "hidden", nullable: false })
    hidden: boolean;

    @Column("integer", { name: "user1id", nullable: true, unique: true })
    user1id: number | null;
  
    @Column("integer", { name: "user2id", nullable: true, unique: true })
    user2id: number | null;
  
    @ManyToOne(() => User, (users) => users.directmessages)
    @JoinColumn([{ name: "user1id", referencedColumnName: "id" }])
    user1: User;
  
    @ManyToOne(() => User, (users) => users.directmessages)
    @JoinColumn([{ name: "user2id", referencedColumnName: "id" }])
    user2: User;
  }
  