import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';

@Entity({ name: 'user_posts' })
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: null })
  title: string;

  @Column({ default: null })
  description: string;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;
}
