import { Injectable, NestMiddleware } from '@nestjs/common'
import * as express from 'express'

@Injectable()
class CrossDomainMiddleware implements NestMiddleware {
  use(req: express.Request, res: express.Response, next: express.NextFunction) {
    res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Headers', req.headers['access-control-request-headers'] || '*');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

    next();
  }
}

export default CrossDomainMiddleware

