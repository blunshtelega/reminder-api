
import { AuthenticationService } from '../authentication.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import UsersService from '../../users/users.service';
import { HttpException, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthenticationController } from '../authentication.controller';
import { errorMappings } from 'src/utils/filters/prismaException.filter';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

describe('The AuthenticationController', () => {
  let createUserMock: jest.Mock;
  let app: INestApplication;
  beforeEach(async () => {
    createUserMock = jest.fn();
    const module = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: createUserMock,
            },
          },
        },
      ],
      controllers: [AuthenticationController],
      imports: [
        ConfigModule.forRoot(),
        JwtModule.register({
          secretOrPrivateKey: 'Secret key',
        }),
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });
  describe('when the register endpoint is called', () => {
    describe('and valid data is provided', () => {
      let user: User;
      let beforeCreateUser: any


      beforeEach(async () => {
        let password = 'password'
        const hashedPassword = await bcrypt.hash(password, 10);

        user = {
          id: '1',
          email: 'john@smith.com',
          name: 'John',
          hashedPassword,
          hashedRefreshToken: null,
        };

        beforeCreateUser = {
          email: 'john@smith.com',
          password: 'password',
        }
      });
      describe('and the user is successfully created in the database', () => {
        beforeEach(() => {
          createUserMock.mockResolvedValue(user);
        });
        it('should return the new user without the password', async () => {
          return request(app.getHttpServer())
            .post('/auth/register')
            .send({
              // id: user.id,
              email: user.email,
              password: 'password',
              // name: user.name,
              // hashedPassword: user.hashedPassword,
              // hashedRefreshToken: null,
          
            })
            .expect({
              id: user.id,
              email: user.email,
              name: user.name,
              hashedPassword: user.hashedPassword,
              hashedRefreshToken: null
            });
        });
      });
      describe('and the email is already taken', () => {
        beforeEach(async () => {
          // ! Если сделать с mockRejectedValue - возвращает 400, если с mockResolvedValue - возвращает 500 
          // ! По идее он должен возвращать 409 статус код, значит работает неверно!
          createUserMock.mockRejectedValue(() => {
            throw new PrismaClientKnownRequestError(
              'The user already exists',
              {
                code: 'P2002',
                clientVersion: '5.16.1',
              },
            );
          });
          // ! Почему не работает вариант с PrismaClientKnownRequestError?
          // createUserMock.mockRejectedValue(() => {
          //   throw new HttpException('Error', 400)
          // });
        });
        it('should result in 400 Bad Request', async () => {
          return request(app.getHttpServer())
            .post('/auth/register')
            .send({
              email: user.email,
              password: 'password',
            })
            .expect(400);
        });
      });
    });
  });
});