import type { Http, HttpOptions } from '@/http';
import { default as http } from '@/http';
import { handleExpress404, handleHttpException, inferResponseType } from '@/http/nodegen/middleware';
import routesImporter from '@/http/nodegen/routesImporter';
import { default as express } from 'express';
import { format } from 'node:util';

export const configure = async (port: number, errorMiddleware: HttpOptions['errorMiddleware'] = []): Promise<Http> => {
  const app = express();
  app.use(inferResponseType());

  routesImporter(app);
  app.use(handleExpress404());
  app.use(handleHttpException({
    errorLogger: (error: Error) => {
      if (!process.env.LOG_SKIP || !new RegExp(process.env.LOG_SKIP).test(format(error))) {
        console.error(error.stack || error);
      }
    },
  }));

  return http(port, { app, appMiddlewareOptions: {}, errorMiddleware });
};
