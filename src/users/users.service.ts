import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import CreateUserDto from './dto/createUser.dto';
import { PrismaService } from '../prisma/prisma.service';
import UpdateUserDto from './dto/updateUser.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UUID } from 'crypto';

@Injectable()
export default class UsersService {
  constructor(
    private readonly prisma: PrismaService
  ) {}

  async getUsers(): Promise<User[]> {
    try {
      return await this.prisma.user.findMany();
    } catch(ex: unknown) {
      if (ex instanceof PrismaClientKnownRequestError) throw new PrismaClientKnownRequestError('', ex);
      else throw new HttpException('Не удалось получить список пользователей', HttpStatus.BAD_REQUEST);
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      return await this.prisma.user.findFirst({
        where: {
          id,
        },
      });
    } catch(ex: unknown) {
      if (ex instanceof PrismaClientKnownRequestError) throw new PrismaClientKnownRequestError('', ex);
      else throw new HttpException(`Не удалось найти пользователя по ID ${id}`, HttpStatus.BAD_REQUEST);
    }
  }

  async getUserIfRefreshTokenMatches(refreshToken: string, userId: string) {
    try {
      const user = await this.getUserById(userId);
  
      if (!user) throw new HttpException(`Не удалось найти пользователя по ID ${userId}`, HttpStatus.BAD_REQUEST);
      if (!user.hashedRefreshToken) throw new HttpException(`У пользователя под ID ${userId} отсутствует refresh token`, HttpStatus.BAD_REQUEST);

      const isRefreshTokenMatching = await bcrypt.compare(
        refreshToken,
        user.hashedRefreshToken,
      )

      if (isRefreshTokenMatching) {
        return user;
      }
    } catch(ex: unknown) {
      new HttpException(`Токены отличаются у пользователя под ID - ${userId}`, HttpStatus.BAD_REQUEST);
    }
  }

  async removeRefreshToken(userId: UUID): Promise<User | null> {
    try {
      return await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          hashedRefreshToken: null,
        }
      })
    } catch(ex: unknown) {
      if (ex instanceof PrismaClientKnownRequestError) throw new PrismaClientKnownRequestError('', ex);
      else throw new HttpException(`Не удалось обновить пользователя по ID ${userId}`, HttpStatus.BAD_REQUEST);
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
    } catch(ex: unknown) {
      if (ex instanceof PrismaClientKnownRequestError) throw new PrismaClientKnownRequestError('', ex);
      else throw new HttpException(`Не удалось найти пользователя по почте ${email}`, HttpStatus.BAD_REQUEST);
    }
  }

  async setCurrentRefreshToken(userId: string, refreshToken: string): Promise<void> {
    try {
      const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);

      await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          hashedRefreshToken: currentHashedRefreshToken,
        },
      })
    } catch(ex: unknown) {
      if (ex instanceof PrismaClientKnownRequestError) throw new PrismaClientKnownRequestError('', ex);
      else throw new HttpException('Ошибка авторизации', HttpStatus.BAD_REQUEST);
    }
  }

  async createUser(user: CreateUserDto): Promise<User> {
    try { 
      return await this.prisma.user.create({
        data: user,
      });
    } catch(ex: unknown) {
      if (ex instanceof PrismaClientKnownRequestError) throw new PrismaClientKnownRequestError('', ex);
      else throw new HttpException('Не удалось создать пользователя', HttpStatus.BAD_REQUEST);
    }
  }

  async updateUser(id: string, user: UpdateUserDto): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          ...user,
        },
      });
    } catch(ex: unknown) {
      if (ex instanceof PrismaClientKnownRequestError) throw new PrismaClientKnownRequestError('', ex);
      else throw new HttpException('Не удалось обновить пользователей', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteUser(id: string) {
    try {
      return await this.prisma.user.delete({
        where: {
          id,
        },
      });
    } catch(ex: unknown) {
      if (ex instanceof PrismaClientKnownRequestError) throw new PrismaClientKnownRequestError('', ex);
      else throw new HttpException(`Не удалось удалить пользователя под ID ${id}`, HttpStatus.BAD_REQUEST);
    }
  }
}