import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/entities/Post';
import { User } from 'src/entities/User';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
