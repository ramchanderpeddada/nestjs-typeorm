import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/CreateUser.dto';
import { CreateUserPostDto } from './dtos/CreateUserPost.dto';
import { UpdateUserDto } from './dtos/UpdateUser.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.getUserById(parseInt(id));
    return user;
  }

  @Get(':id/posts')
  async getUserWithPosts(@Param('id') id: number) {
    return this.userService.getUserWithPosts(id);
  }

  // @Get(':id/posts/:id')
  // async getSingleUserPost(
  //   @Param('userId', ParseIntPipe) userId: number,
  //   @Param('postId', ParseIntPipe) postId: number,
  // ) {
  //   const post = await this.userService.getSingleUserPost(userId, postId);
  //   return post;
  // }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Put(':id')
  async updateUserById(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    console.log(updateUserDto);
    return await this.userService.updateUser(id, updateUserDto);
  }

  @Post(':id/posts')
  createUserPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() createUserPostDto: CreateUserPostDto,
  ) {
    return this.userService.createUserPost(id, createUserPostDto);
  }

  @Delete(':id')
  async deleteUserWithPosts(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUserWithPosts(id);
  }

  // @Delete(':id/posts')
  // async deletePost(@Param('id', ParseIntPipe) id: number) {
  //   this.userService.deletePost(id);
  // }
  // @Post('register')
  // async register(@Body() user: User): Promise<void> {DELETE
  //   this.userService.createUser(user);
  // }
}
