import { Test } from '@nestjs/testing';
import UsersService from '../users.service';
import { PrismaService } from '../../../src/prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
// import { UserNotFoundException } from '../users/exceptions/userNotFound.exception';
import { BadRequestException, HttpException, NotFoundException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PrismaModule } from '../../prisma/prisma.module';

describe('UsersService', () => {
  let usersService: UsersService;
  // let findUniqueMock: jest.Mock;
  // let findManyMock: jest.Mock;
  const prismaMock = {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    // findUniqueMock = jest.fn();
    // findManyMock = jest.fn();
    const module = await Test.createTestingModule({
      providers: [
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: prismaMock.user.findUnique,
            },
          },
        },
        UsersService,
      ],
    }).compile();

    // usersService = module.get<UsersService>(UsersService);
    usersService = await module.get(UsersService);

    // prismaMock.user.findUnique.mockClear();
    // prismaMock.user.findMany.mockClear();
  });

  describe('getUserByUsername', () => {
    describe('and the findUnique method returns the user', () => {
      let existingUser: User;
      beforeEach(() => {
        // prismaMock.user.findUnique.mockClear();

        existingUser = {
          id: '1',
          email: 'john@smith.com',
          name: 'John',
          hashedPassword: '123',
          hashedRefreshToken: null,
        };

        prismaMock.user.findUnique.mockResolvedValue(existingUser);
      });
      it('should return the user', async () => {
        const result = await usersService.getUserByEmail(existingUser.email);
        expect(result).toEqual(existingUser);
      });
    });

    // ! Рабочий вариант если мы возвращаем null на нулевой поиск
    // describe('If we return null for user not found', () => {
    //   beforeEach(() => {
    //     prismaMock.user.findUnique.mockResolvedValue(null);
    //   });
    //   it('should return null', async () => {
    //     const result = await usersService.getUserByEmail('ffs@gmail.com');
    //     expect(result).toEqual(null);
    //   });
    // });

    // ! Рабочий вариант если мы выкидываем ошибку при отсутствие пользователя
    // describe('If an error is thrown, the result will be as follows', () => {
    //   beforeEach(() => {
    //     prismaMock.user.findUnique.mockResolvedValue(undefined);
    //   });
    //   it('should throw the HttpException', async () => {
    //     await expect(
    //       usersService.getUserByEmail('123'),
    //     ).rejects.toThrow(HttpException);
    //   });
    // });
  });
});