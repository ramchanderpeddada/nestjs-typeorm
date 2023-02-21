import { Injectable } from '@nestjs/common';
import { User } from './user.entity';

@Injectable()
export class UserService {
  public authUsers: User[] = [
    {
      username: 'admin',
      password: 'github@123',
      email: 'admin@github.com',
    },
    {
      username: 'github',
      password: 'Github123',
      email: 'user@github.com',
    },
  ];

  getUserByName(username: string): User {
    return this.authUsers.find((user: User) => user.username === username);
  }
}
