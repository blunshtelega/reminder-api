

import { NotFoundException } from '@nestjs/common';
import { UUID } from 'crypto';

class UserNotFoundException extends NotFoundException  {
  constructor(email: string) {
    super(`User with email ${email} not found`);
  }
}

export default UserNotFoundException