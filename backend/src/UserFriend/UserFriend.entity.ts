import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "../Users/user.entity";

@Index("unique_user_friend_pair", ["friendid", "userid"], { unique: true })
@Index("userfriends_pkey", ["id"], { unique: true })
@Entity("userfriends", { schema: "public" })
export class UserFriend {
  @PrimaryGeneratedColumn({ type: "integer", name: "id" })
  id: number;

  @Column("integer", { name: "userid", nullable: true, unique: true })
  userid: number | null;

  @Column("integer", { name: "friendid", nullable: true, unique: true })
  friendid: number | null;

  @ManyToOne(() => User, (users) => users.userfriends)
  @JoinColumn([{ name: "friendid", referencedColumnName: "id" }])
  friend: User;

  @ManyToOne(() => User, (users) => users.userfriends2)
  @JoinColumn([{ name: "userid", referencedColumnName: "id" }])
  user: User;
}
