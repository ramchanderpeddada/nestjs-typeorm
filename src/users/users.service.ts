import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/Post';
import { Profile } from 'src/entities/Profile';
import { User } from 'src/entities/User';
import { CreateUserPostDto } from 'src/users/dtos/CreateUserPost.dto';
import { CreateUserProfileDto } from 'src/users/dtos/CreateUserProfile.dto';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { UpdateUserDto } from './dtos/UpdateUser.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Profile) private profileRepo: Repository<Profile>,
    @InjectRepository(Post) private postRepo: Repository<Post>,
  ) {}

  getUsers() {
    return this.userRepo.find({ relations: ['posts', 'profile'] });
  }

  async getUserById(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['profile', 'posts'],
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

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const result = await this.userRepo.update({ id }, { ...updateUserDto });
    if (result.affected === 0) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
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
  async getUserProfile(id: number) {
    return this.userRepo.findOneBy({ id });
  }

  async createUserProfile(
    id: number,
    createUserProfileDetails: CreateUserProfileDto,
  ) {
    const user = await this.userRepo.findOneBy({ id });
    if (!user)
      throw new HttpException(
        "User Not found. Can't Create profile",
        HttpStatus.BAD_REQUEST,
      );

    const newProfile = this.profileRepo.create(createUserProfileDetails);
    const saveProfile = await this.profileRepo.save(newProfile);
    user.profile = saveProfile;
    return this.userRepo.save(user);
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

  async getSingleUserPost(userId: number, postId: number) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['posts'],
    });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    const post = user.posts.find((p) => p.id === userId);
    if (!post) {
      throw new NotFoundException(
        `Post with id ${postId} not found for user ${userId}`,
      );
    }

    return post;
  }
  async getUserWithPosts(id: number) {
    const user = await this.userRepo.findOne({
      where: { id },
      relations: ['posts'],
    });
    if (!user) {
      // User not found
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async deletePost(id: number) {
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) {
      throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
    }
    return 'Post deleted succesfully';
  }
}
