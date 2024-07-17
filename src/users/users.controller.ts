
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '@prisma/client';
import UsersService from './users.service';
import CreateUserDto from './dto/createUser.dto';
import UpdateUserDto from './dto/updateUser.dto';
import { StringParamsDto } from './../utils/dto/stringParams.dto';
import { UserResponseDto } from './dto/userResponse.dto';
import { DataSerializationInterceptor } from '../utils/interceptors/transformData.interceptor'; 
import JwtAuthGuard from '../authentication/guards/jwtAuth.guard';

@Controller('users')
@UseInterceptors(new DataSerializationInterceptor(UserResponseDto))
export default class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) {}
  
  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers(): Promise<User[] | []> {
    return await this.usersService.getUsers();
  }

  @Get('/email/:email')
  async getUserByEmail(@Param() email): Promise<any> {
    return await this.usersService.getUserByEmail('test@mail.ru');
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getUserById(@Param() { id }: StringParamsDto) {
    const user = await this.usersService.getUserById(id);

    return {
      success: user !== null,
      data: user === null ? user : new UserResponseDto(user)
    }
  }

  @Post('create')
  async createUser(@Body() user: CreateUserDto): Promise<User> {
    return await this.usersService.createUser(user);
  }

  @HttpCode(200)
  @Post(':id')
  async updateUser(@Param() { id }: StringParamsDto, @Body() user: UpdateUserDto): Promise<User> {
    return await this.usersService.updateUser(id, user);
  }

  @Delete(':id')
  async deleteUser(@Param() { id }: StringParamsDto): Promise<User> {
    return await this.usersService.deleteUser(id);
  }
}