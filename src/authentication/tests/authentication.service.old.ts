
import { AuthenticationService } from '../authentication.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import {jest, test} from '@jest/globals';
import { Test } from '@nestjs/testing';
import UsersService from '../../users/users.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
// import { UserNotFoundException } from '../users/exceptions/userNotFound.exception';
import { BadRequestException, HttpException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../../users/users.module';
import { LocalStrategy } from '../strategies/local.strategy';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { JwtRefreshTokenStrategy } from '../strategies/jwtRefreshToken.strategy';

describe('The AuthenticationService', () => {
  let authenticationService: AuthenticationService;
  let userService: UsersService;
  let password: string;
  let getByEmailMock: jest.Mock;

  beforeEach(async () => {
    getByEmailMock = jest.fn();
    const module = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        // ! Нужны ли тут стратегии?
        // {
        //   provide: UsersService,
        //   useValue: {
        //     getByEmail: getByEmailMock,
        //   },
        // },
      ],
      imports: [
        // ! Импортируем именно модули, а не сервисы!
        ConfigModule,
        JwtModule,
        UsersModule,
      ],
    }).compile();

    authenticationService = await module.get(AuthenticationService);
  });

  describe('when calling the getCookieForLogOut method', () => {
    it('should return a correct string', () => {
      const result = authenticationService.getCookiesForLogOut();
      expect(result).toStrictEqual([
        'Authentication=; HttpOnly; Path=/; Max-Age=0',
        'Refresh=; HttpOnly; Path=/; Max-Age=0'
      ]);
    });
  });

  // describe('when the getAuthenticatedUser method is called', () => {
  //   describe('and a valid email and password are provided', () => {
  //     let userData: any;
  //     beforeEach(async () => {
  //       password = 'password';
  //       const hashedPassword = await bcrypt.hash(password, 10);
        
  //       userData = {
  //         id: '1',
  //         email: 'blunshtelega@gmail.com',
  //         name: null,
  //         hashedPassword,
  //         hashedRefreshToken: null,
  //       };
  //       getByEmailMock.mockResolvedValue(userData); // 👈
  //       // const getByEmailMock2 = jest.fn<() => Promise<any>>().mockResolvedValue(userData);

  //       // await getByEmailMock2()
        
  //     });
  //     it('should return the new user', async () => {
  //       const result = await authenticationService.getAuthenticatedUser(
  //         userData.email,
  //         password,
  //       );
  //       expect(result).toBe(userData);
  //     });
  //   });

  //   // describe('and an invalid email is provided', () => {
  //   //   beforeEach(() => {
  //   //     getByEmailMock.mockRejectedValue(null); // 👈
  //   //     // getByEmailMock.mockRejectedValue(new HttpException('Код ошибки', 400)); // 👈

  //   //   });
  //   //   it('should throw the BadRequestException', () => {
  //   //     return expect(async () => {
  //   //       await authenticationService.getAuthenticatedUser(
  //   //         '123@gmail.com',
  //   //         'password',
  //   //       );
  //   //     }).rejects.toThrow(HttpException);
  //   //   });
  //   // });
  // });
});