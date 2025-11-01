import type { Request } from 'express';
export type NodegenRequest = Request & { defaultContentType?: string; };
export default NodegenRequest;
