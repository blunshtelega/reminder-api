
import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class UserResponseDto implements User {
  id: string;
  email: string;
  name: string | null;

  @Exclude()
  hashedPassword: string;

  @Exclude()
  hashedRefreshToken: string | null;

  constructor(partial: Partial<UserResponseDto>) {
    Object.assign(this, partial);
  }
}