import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
export default class LocalAuthGuard extends AuthGuard('local') {
  constructor(private reflector: Reflector) {
    super();
  }
  
  // canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
  //   return true
  //   // Add your custom authentication logic here
  //   // for example, call super.logIn(request) to establish a session.
  // }

  // handleRequest(err, user, info) {
  //   console.log('start here')
  //   // You can throw an exception based on either "info" or "err" arguments
  //   if (err || !user) {
  //     throw err || new UnauthorizedException();
  //   }
  //   return user;
  // }
}