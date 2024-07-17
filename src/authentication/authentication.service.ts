import UsersService from "../users/users.service";
import RegisterDto from "./dto/register.dto";
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import TokenPayload from './interfaces/tokenPayload.interface';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { UUID } from "crypto";

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  public async getCookieWithJwtAccessToken(userId: UUID): Promise<string> {
    try {
      const payload: TokenPayload = { userId };

      const token = await this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
        expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`,
      });
  
      return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`;
    } catch(ex: unknown) {
      throw new HttpException('Ошибка получения access JWT cookie', HttpStatus.BAD_REQUEST);
    }
  }

  public async getCookieWithJwtRefreshToken(userId: UUID): Promise<{ refreshCookie: string, refreshToken: string }> {
    try {
      const payload: TokenPayload = { userId };

      const refreshToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
        expiresIn: `${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}s`,
      });
  
      const refreshCookie = `Refresh=${refreshToken}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME')}`;
      
      return {
        refreshCookie,
        refreshToken
      }
    } catch(ex: unknown) {
      throw new HttpException('Ошибка получения refresh JWT cookie', HttpStatus.BAD_REQUEST);
    }
  }

  public async register(registrationData: RegisterDto) {
    try {
      const hashedPassword = await bcrypt.hash(registrationData.password, 10);

      const createdUser = await this.usersService.createUser({
        email: registrationData.email,
        hashedPassword: hashedPassword,
      });

      return createdUser;
    } catch (ex: unknown) {
      if (ex instanceof PrismaClientKnownRequestError) throw new PrismaClientKnownRequestError('', ex);
      else throw new HttpException('Не удалось создать пользователя', HttpStatus.BAD_REQUEST);
    }
  }

  public getCookiesForLogOut(): string[] {
    return [
      'Authentication=; HttpOnly; Path=/; Max-Age=0',
      'Refresh=; HttpOnly; Path=/; Max-Age=0'
    ];
  }

  public async getAuthenticatedUser(email: string, password: string) {
    try {
      const user = await this.usersService.getUserByEmail(email);

      if (!user) throw new HttpException('Неверные данные авторизации', HttpStatus.BAD_REQUEST);

      await this.verifyPassword(password, user.hashedPassword);

      return user;
    } catch (ex: unknown) {
      // ! Переделать на BadRequestException?
      throw new HttpException('Неверные данные авторизации', HttpStatus.BAD_REQUEST);
    }
  }

  private async verifyPassword(plainTextPassword: string, hashedPassword: string): Promise<void> {
    try {
      const isPasswordMatching = await bcrypt.compare(
        plainTextPassword,
        hashedPassword
      );

      if (!isPasswordMatching) {
        throw new HttpException('Неверные данные авторизации', HttpStatus.BAD_REQUEST);
      }
    } catch(ex: unknown) {
      throw new HttpException('Неверные данные авторизации', HttpStatus.BAD_REQUEST);
    }
  }
}