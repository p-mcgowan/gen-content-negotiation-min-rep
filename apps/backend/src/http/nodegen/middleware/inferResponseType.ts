import NodegenRequest from '@/http/interfaces/NodegenRequest';
import { NotAcceptableException } from '@/http/nodegen/errors';
import GenerateItExpressResponse from '@/http/nodegen/interfaces/GenerateItExpressResponse';
import getPreferredResponseFormat from '@/http/nodegen/utils/getPreferredResponseFormat';
import express from 'express';
import objectReduceByMap from 'object-reduce-by-map';

export default () => {
  return (req: NodegenRequest, res: GenerateItExpressResponse, next: express.NextFunction) => {
    const apiProduces = ''
      .split(',')
      .reduce((a: string[], s: string) => a.concat(s.toLowerCase(), s.replace(/;.*/, '').trim().toLowerCase()), []);

    res.inferResponseType = (
      dataOrPath = undefined,
      status = 200,
      produces?: string,
      outputMap?: Record<string, any>
    ) => {
      // Send only a status when data is undefined
      if (dataOrPath === undefined) {
        return res.sendStatus(status);
      }

      const accept = (req.headers['accept'] || '*/*').toLowerCase();

      const possibleResponseTypes: string[] = (
        produces ? [...produces.split(',')] : ['application/json', ...apiProduces]
      ).filter(Boolean);

      const responseContentType = getPreferredResponseFormat(accept, possibleResponseTypes) || req.defaultContentType;
      if (!responseContentType) {
        throw new NotAcceptableException(
          `Requested content-type "${accept}" not supported. Supported content types are "${possibleResponseTypes.join('", "')}"`,
        );
      }
      res.set('Content-Type', responseContentType);

      // No "produces", or json in the openapi file
      if (/(application\/json|application\/vnd\.api\+json)(;.*)?/.test(responseContentType)) {
        return res.status(status).json(objectReduceByMap(dataOrPath, outputMap as object, {"allowNullish":false,"keepKeys":false,"throwErrorOnAlien":false,"allowNullishKeys":false}));
      }

      // All images use with sendFile
      if (responseContentType.startsWith('image/') || responseContentType.startsWith('font/')) {
        return res.sendFile(dataOrPath);
      }

      // Simple pass for text/* let the consumer handle the rest
      if (responseContentType.startsWith('text/')) {
        return res.status(status).send(dataOrPath);
      }

      // If dataOrPath is a string, then it's probably a path to a file to download.
      if (typeof dataOrPath === 'string') {
        return res.download(dataOrPath);
      }

      // Otherwise, content-type is set and we just send the data (could be a buffer)
      return res.send(dataOrPath);
    };

    next();
  };
};
