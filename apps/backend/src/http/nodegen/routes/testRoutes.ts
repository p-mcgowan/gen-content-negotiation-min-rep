import express from 'express';
import Router from 'express-promise-router';

import testValidators from '../validators/testValidators';
import TestDomain from '../../../domains/TestDomain';
import testTransformOutputs from '../transformOutputs/testTransformOutput';
import GenerateItExpressResponse from '@/http/nodegen/interfaces/GenerateItExpressResponse';

export default function () {
  const router = Router();

  /**
   * Operation ID: testAlsoBothGet
   * Summary: Produces both html and json
   * Description: Trying to get getSingleSuccessResponse template helper to put both produces in the routes file, didnt work
   */

  router.get(
    '/also-both' /* x-raw-body on path not found: Format the body */,
    express.json({ limit: '50mb' }),
    async (req: any, res: GenerateItExpressResponse) => {
      res.inferResponseType(
        await TestDomain.testAlsoBothGet(req),
        200,
        'application/json',
        testTransformOutputs.testAlsoBothGet
      );
    }
  );

  /**
   * Operation ID: testBothGet
   * Summary: Produces both html and json
   *
   */

  router.get(
    '/both' /* x-raw-body on path not found: Format the body */,
    express.json({ limit: '50mb' }),
    async (req: any, res: GenerateItExpressResponse) => {
      res.inferResponseType(
        await TestDomain.testBothGet(req),
        200,
        'text/html',
        testTransformOutputs.testBothGet
      );
    }
  );

  /**
   * Operation ID: testHtmlGet
   * Summary: Produces html
   *
   */

  router.get(
    '/html' /* x-raw-body on path not found: Format the body */,
    express.json({ limit: '50mb' }),
    async (req: any, res: GenerateItExpressResponse) => {
      res.inferResponseType(
        await TestDomain.testHtmlGet(),
        200,
        'text/html',
        testTransformOutputs.testHtmlGet
      );
    }
  );

  /**
   * Operation ID: testJsonGet
   * Summary: Produces json
   *
   */

  router.get(
    '/json' /* x-raw-body on path not found: Format the body */,
    express.json({ limit: '50mb' }),
    async (req: any, res: GenerateItExpressResponse) => {
      res.inferResponseType(
        await TestDomain.testJsonGet(),
        200,
        'application/json',
        testTransformOutputs.testJsonGet
      );
    }
  );

  return router;
}
