import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from "typeorm";
  import { User } from "../Users/user.entity";
  
  @Index("gamehistory_pkey", ["id"], { unique: true })
  @Entity("gamehistory", { schema: "public" })
  export class Gamehistory {
    @PrimaryGeneratedColumn({ type: "integer", name: "id" })
    id: number;
  
    @Column("integer", { name: "user1point", nullable: true })
    user1point: number | null;
  
    @Column("integer", { name: "user2point", nullable: true })
    user2point: number | null;
  
    @ManyToOne(() => User, (users) => users.gamehistories)
    @JoinColumn([{ name: "user1id", referencedColumnName: "id" }])
    user: User;
  
    @ManyToOne(() => User, (users) => users.gamehistories2)
    @JoinColumn([{ name: "user2id", referencedColumnName: "id" }])
    user2: User;
  }
  