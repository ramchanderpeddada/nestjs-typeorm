import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { CreateUserParams, UpdateUserParams } from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}
  findUsers() {
    return this.userRepo.find();
  }

  createUser(userDetails: CreateUserParams) {
    const newUser = this.userRepo.create({
      ...userDetails,
      createdAt: new Date(),
    });
    this.userRepo.save(newUser);
    return 'User Created Successfully';
  }

  updateUser(id: number, updateUserDetails: UpdateUserParams) {
    this.userRepo.update({ id }, { ...updateUserDetails });
  }

  deleteUser(id: number) {
    this.userRepo.delete(id);
  }
}
