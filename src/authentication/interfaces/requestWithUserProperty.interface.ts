
import { Request } from 'express';
import { UUID } from 'crypto';

interface IRequestWithUserProperty extends Request {
  user: { 
    userId: UUID 
  };
}

export default IRequestWithUserProperty;