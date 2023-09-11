import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users1' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  displayname: string;
}
