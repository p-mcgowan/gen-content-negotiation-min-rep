import type { NextFunction, Request, Response } from 'express';

export default new (class PermissionService {
  middleware(_req: Request, _res: Response, next: NextFunction, _permission: string) {
    next();
  }
})();
