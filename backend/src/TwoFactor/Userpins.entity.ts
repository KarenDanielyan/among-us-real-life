import {
    Column,
    Entity,
    Index,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from "typeorm";
  import { User } from "../Users/user.entity";
  
  @Index("userpins_pkey", ["id"], { unique: true })
  @Entity("userpins", { schema: "public" })
  export class UserPin {
    @PrimaryGeneratedColumn({ type: "integer", name: "id" })
    id: number;
  
    @Column("character varying", {
        name: "pin",
        nullable: false,
        unique: false,
        length: 255,
      })
    pin: string | null;
  
    @Column("integer", { name: "userid", nullable: false, unique: true })
    userid: number | null;
  
    @ManyToOne(() => User, (users) => users.mutelists)
    @JoinColumn([{ name: "userid", referencedColumnName: "id" }])
    user: User;
  }
  