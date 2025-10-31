import type { NextFunction, Request, Response } from 'express';

export type ValidateRequestOptions = unknown;

export default new (class AccessTokenService {
  validateRequest(
    _req: Request,
    _res: Response,
    _next: NextFunction,
    _headerNames: string[],
    _options?: ValidateRequestOptions,
  ): void {}
})();
