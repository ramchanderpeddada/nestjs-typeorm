import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Post } from './Post';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ default: null })
  username: string;

  @Column()
  email: string;

  @Column()
  phone: number;

  @Column()
  createdAt: Date;

  @Column({ nullable: true })
  authStrategy: string;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];
}
