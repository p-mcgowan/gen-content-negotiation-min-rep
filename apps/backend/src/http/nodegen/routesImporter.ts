import config from '@/config';
import express from 'express';
import testRoutes from './routes/testRoutes';

export interface RoutesImporter {
  basePath?: string
}

export const baseUrl = '/v1';

export default function (app: express.Application, options: RoutesImporter = {basePath: baseUrl}) {
  const basePath = (options.basePath || '').replace(/\/+$/, '');

  app.use(basePath + '/test', testRoutes());

  }
