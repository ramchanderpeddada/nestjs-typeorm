import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/entities/Post';
import { Profile } from 'src/entities/Profile';
import { User } from 'src/entities/User';
import { CreateUserPostDto } from 'src/users/dtos/CreateUserPost.dto';
import { CreateUserProfileDto } from 'src/users/dtos/CreateUserProfile.dto';
import { CreateUserParams, UpdateUserParams } from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Profile) private profileRepo: Repository<Profile>,
    @InjectRepository(Post) private postRepo: Repository<Post>,
  ) {}

  findUsers() {
    return this.userRepo.find({ relations: ['profile', 'posts'] });
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
    return 'User Deleted Succesfully';
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
}
