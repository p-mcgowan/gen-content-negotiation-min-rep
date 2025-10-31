import type { NextFunction, Request, Response } from 'express';

export default new (class HttpHeadersCacheService {
  middleware(_req: Request, _res: Response, next: NextFunction) {
    next();
  }
})();
