import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/Post';
import { User } from 'src/entities/User';
import { CreateUserPostDto } from 'src/users/dtos/CreateUserPost.dto';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { UpdateUserDto } from './dtos/UpdateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Post) private postRepo: Repository<Post>,
  ) {}

  getUsers() {
    return this.userRepo.find({ relations: ['posts'] });
  }

  async getUserById(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  createUser(userDetails: CreateUserDto) {
    const newUser = this.userRepo.create({
      ...userDetails,
      createdAt: new Date(),
    });
    this.userRepo.save(newUser);
    return 'User Created Successfully';
  }
  // async updateUser(id: number, updateUserDto: UpdateUserDto) {
  //   const result = await this.userRepo.update({ id }, { ...updateUserDto });
  //   // const result = await this.userRepo.update(id, updateUserDto);
  //   if (result.affected === 0) {
  //     throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  //   }
  // }
  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['posts'],
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return this.userRepo.update(id, updateUserDto);
  }

  async deleteUserWithPosts(id: number) {
    // Check if user exists
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['posts'],
    });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    // Delete all user's posts
    if (user.posts.length > 0) {
      const postIds = user.posts.map((post) => post.id);
      await this.postRepo.delete(postIds);
    }
    // Delete user
    await this.userRepo.delete(id);
    return `User with id ${id} and their ${user.posts.length} posts deleted successfully`;
  }

  async createUserPost(id: number, createUserPostDetails: CreateUserPostDto) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user)
      throw new HttpException(
        "User Not found. Can't Create profile",
        HttpStatus.BAD_REQUEST,
      );
    const newPost = this.postRepo.create({
      ...createUserPostDetails,
      user,
    });
    return this.postRepo.save(newPost);
  }

  async getUserWithPosts(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['posts'],
    });
    return user;
  }
}
