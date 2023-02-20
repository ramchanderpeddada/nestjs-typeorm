import { Injectable } from '@nestjs/common';

export type UserAuth = any;
@Injectable()
export class UserAuthService {
  private readonly user = [
    {
      userId: 1,
      username: 'ram',
      password: 'password',
    },
    {
      userId: 2,
      username: 'nestjs',
      password: 'root',
    },
  ];

  async findOne(username: string) {
    return this.user.find((user) => user.username === username);
  }
}
