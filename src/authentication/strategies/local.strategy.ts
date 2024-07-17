
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from '../authentication.service';
import { UUID } from 'crypto';

// If credentials valid, creating the user property on the Request object
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthenticationService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<{ userId: UUID }> {
    const user = await this.authService.getAuthenticatedUser(email, password);

    if (!user) throw new UnauthorizedException()
    return { userId: user.id as UUID}
  }
}