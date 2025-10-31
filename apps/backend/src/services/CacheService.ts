import type { NextFunction } from 'express';

export default new (class CacheService {
  middleware(_req: unknown, _res: unknown, next: NextFunction, _transformOutputMap: unknown) {
    next();
  }
})();
