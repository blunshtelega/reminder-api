
import { Body, Req, Get, Res, Controller, HttpCode, Post, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import RegisterDto from './dto/register.dto';
// import IRequestWithUser from './interfaces/requestWithUser.interface';
import { LocalAuthenticationGuard } from './guards/localAuth.guard';
import { Request, Response } from 'express'
import JwtAuthenticationGuard from './guards/jwtAuth.guard';
import UsersService from '../users/users.service';
import JwtRefreshGuard from './guards/jwrRefresh.guard';
import ITypedRequest from 'src/utils/interfaces/request.interface';
import ICustomHeaders from 'src/utils/interfaces/customHeaders.interface';
import ICustomQuery from 'src/utils/interfaces/customQuery.interface';
import { UUID } from 'crypto';
// import RequestWithUserProperty from './interfaces/requestWithUser.interface';
import IRequestWithUserProperty from './interfaces/requestWithUserProperty.interface';
// import AuthCookieEnum from "./enum/authCookieTypes.enum";


@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly usersService: UsersService
  ) {}

  @Post('register')
  async register(@Body() registrationData: RegisterDto) {
    return this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @Post('log-in')
  async logIn(
    @Req() request: IRequestWithUserProperty, 
    @Res() response: Response
  ) {
    const { userId } = request.user;

    const accessTokenCookie = await this.authenticationService.getCookieWithJwtAccessToken(userId);
    const { refreshCookie, refreshToken } = await this.authenticationService.getCookieWithJwtRefreshToken(userId);

    await this.usersService.setCurrentRefreshToken(userId, refreshToken);

    response.setHeader('Set-Cookie', [accessTokenCookie, refreshCookie]);
    response.status(200).json({ success: true, })
  }

  @UseGuards(JwtRefreshGuard)
  @Get('refresh')
  async refresh(
    @Req() request: IRequestWithUserProperty, 
    @Res() response: Response
  ) {
    const { userId } = request.user;

    const accessTokenCookie = await this.authenticationService.getCookieWithJwtAccessToken(userId);

    response.setHeader('Set-Cookie', accessTokenCookie);
    response.status(200).json({ success: true, })
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('log-out')
  @HttpCode(200)
  async logOut(
    @Req() request: IRequestWithUserProperty, 
    @Res() response: Response
  ) {
    const { userId } = request.user;

    await this.usersService.removeRefreshToken(userId);

    response.setHeader('Set-Cookie', this.authenticationService.getCookiesForLogOut());
    response.status(200).json({ success: true, })
  }
}

