import type { Response as SupertestResponse, Test } from 'supertest';
import type TestAgent from 'supertest/lib/agent';
import type { Http } from '../src/http';

import assert from 'node:assert';
import { before, describe, it } from 'node:test';
import { format } from 'node:util';
import { default as supertest } from 'supertest';
import { configure } from '../src/app';
import { handleHttpException } from '../src/http/nodegen/middleware';

const accept = {
  json: 'application/json',
  any: '*/*',
  empty: '',
  plaintext: 'text/plain',
  html: 'text/html',
  jsonOrHtml: 'application/json,text/html;q=0.5,application/*',
  applicationOrHtml: 'application/*,text/html;q=0.5',
  htmlOrJson: 'text/html,application/json;q=0.5,application/*',
  htmlOrApplication: 'text/html,application/*;q=0.5',
  jsonOrText: 'application/json,text/*;q=0.5',
  textOrJson: 'text/*,application/json;q=0.5',
  invalidWeight: 'text/*;q=0.1, text/html ; q = 0.9 , application/vnd+json; q=1, application/json;q=asdf',
  invalidLength: 'text/*;q=0.1, text/html ; q = 0.9 , application/vnd+json; q=1, application/json;q=asdf'.repeat(12),
};

describe('accept / content-type testing', async () => {
  let server: Http;
  let client: TestAgent<Test> & { silence: (...regex: string[]) => TestAgent<Test> };

  before(async () => {
    server = await configure(0, [
      handleHttpException({
        errorLogger: (error: Error) => {
          if (!process.env.LOG_SKIP || !new RegExp(process.env.LOG_SKIP).test(format(error))) {
            console.error('x', error.stack || error);
          }
        },
      }),
    ]);
    client = supertest.agent(server.expressApp) as TestAgent<Test> & {
      silence: (...regex: string[]) => TestAgent<Test>;
    };
    client.silence = function (...regex: string[]) {
      const prev = process.env.LOG_SKIP;
      process.env.LOG_SKIP = regex.join('|');
      this.once('end', () => {
        if (prev) {
          process.env.LOG_SKIP = prev;
        } else {
          delete process.env.LOG_SKIP;
        }
      });

      return this;
    };
  });

  const html = ({ status, text, headers: { 'content-type': contentType } }: SupertestResponse) => {
    assert.deepStrictEqual(
      { status, text, contentType },
      { status: 200, text: '<h1> Hi </h1>', contentType: 'text/html; charset=utf-8' },
    );
  };
  // note: gen-it doesn't handle object / text responses too well
  const json = ({ status, body, headers: { 'content-type': contentType } }: SupertestResponse) => {
    assert.deepStrictEqual(
      { status, body, contentType },
      { status: 200, body: { test: 'true' }, contentType: 'application/json; charset=utf-8' },
    );
  };
  const notAcceptable =
    (message: string) =>
    ({ status, body, headers: { 'content-type': contentType } }: SupertestResponse) => {
      assert.deepStrictEqual(
        { status, body, contentType },
        {
          status: 406,
          body: {
            name: 'HttpException',
            status: 406,
            message: 'Not acceptable',
            body: message,
          },
          contentType: 'application/json; charset=utf-8',
        },
      );
    };
  const tooLarge = ({ status, body }: SupertestResponse) => {
    assert.deepStrictEqual(
      { status, body },
      {
        status: 406,
        body: {
          name: 'HttpException',
          status: 406,
          message: 'Not acceptable',
          body: 'Accept header too large. Max length is 1024',
        },
      },
    );
  };

  await it('handles accept header for produces html', async () => {
    await client
      .silence('Not acceptable')
      .get('/v1/test/html')
      .set({ accept: accept.json })
      .expect(
        notAcceptable(
          'Requested content-type "application/json" not supported. Supported content types are "text/html"',
        ),
      );
    await client.get('/v1/test/html').set({ accept: accept.any }).expect(html);
    await client.get('/v1/test/html').set({ accept: accept.empty }).expect(html);
    await client
      .silence('Not acceptable')
      .get('/v1/test/html')
      .set({ accept: accept.plaintext })
      .expect(
        notAcceptable('Requested content-type "text/plain" not supported. Supported content types are "text/html"'),
      );
    await client.get('/v1/test/html').set({ accept: accept.html }).expect(html);
    await client.get('/v1/test/html').set({ accept: accept.jsonOrHtml }).expect(html);
    await client.get('/v1/test/html').set({ accept: accept.applicationOrHtml }).expect(html);
    await client.get('/v1/test/html').set({ accept: accept.htmlOrJson }).expect(html);
    await client.get('/v1/test/html').set({ accept: accept.htmlOrApplication }).expect(html);
    await client.get('/v1/test/html').set({ accept: accept.jsonOrText }).expect(html);
    await client.get('/v1/test/html').set({ accept: accept.textOrJson }).expect(html);
    await client.get('/v1/test/html').set({ accept: accept.invalidWeight }).expect(html);
    await client.silence('Not acceptable').get('/v1/test/html').set({ accept: accept.invalidLength }).expect(tooLarge);
  });

  await it('handles accept header for produces json', async () => {
    await client.get('/v1/test/json').set({ accept: accept.json }).expect(json);
    await client.get('/v1/test/json').set({ accept: accept.any }).expect(json);
    await client.get('/v1/test/json').set({ accept: accept.empty }).expect(json);
    await client
      .silence('Not acceptable')
      .get('/v1/test/json')
      .set({ accept: accept.plaintext })
      .expect(
        notAcceptable(
          'Requested content-type "text/plain" not supported. Supported content types are "application/json"',
        ),
      );
    await client
      .silence('Not acceptable')
      .get('/v1/test/json')
      .set({ accept: accept.html })
      .expect(
        notAcceptable(
          'Requested content-type "text/html" not supported. Supported content types are "application/json"',
        ),
      );
    await client.get('/v1/test/json').set({ accept: accept.jsonOrHtml }).expect(json);
    await client.get('/v1/test/json').set({ accept: accept.applicationOrHtml }).expect(json);
    await client.get('/v1/test/json').set({ accept: accept.htmlOrJson }).expect(json);
    await client.get('/v1/test/json').set({ accept: accept.htmlOrApplication }).expect(json);
    await client.get('/v1/test/json').set({ accept: accept.jsonOrText }).expect(json);
    await client.get('/v1/test/json').set({ accept: accept.textOrJson }).expect(json);
    await client.get('/v1/test/json').set({ accept: accept.invalidWeight }).expect(json);
    await client.silence('Not acceptable').get('/v1/test/json').set({ accept: accept.invalidLength }).expect(tooLarge);
  });

  await it('handles accept header for produces multiple', async () => {
    // none of this works - the /test/both endpoint never receives both produces items
    await client.get('/v1/test/both').set({ accept: accept.json }).expect(json);
    await client.get('/v1/test/both').set({ accept: accept.any }).expect(html);
    await client.get('/v1/test/both').set({ accept: accept.empty }).expect(html);
    await client
      .silence('Not acceptable')
      .get('/v1/test/both')
      .set({ accept: accept.plaintext })
      .expect(
        notAcceptable(
          'Requested content-type "text/plain" not supported. Supported content types are "application/json", "text/html"',
        ),
      );
    await client.get('/v1/test/both').set({ accept: accept.html }).expect(html);
    await client.get('/v1/test/both').set({ accept: accept.jsonOrHtml }).expect(json);
    await client.get('/v1/test/both').set({ accept: accept.applicationOrHtml }).expect(json);
    await client.get('/v1/test/both').set({ accept: accept.htmlOrJson }).expect(html);
    await client.get('/v1/test/both').set({ accept: accept.htmlOrApplication }).expect(html);
    await client.get('/v1/test/both').set({ accept: accept.jsonOrText }).expect(json);
    await client.get('/v1/test/both').set({ accept: accept.textOrJson }).expect(html);
    await client.get('/v1/test/both').set({ accept: accept.invalidWeight }).expect(html);
    await client.silence('Not acceptable').get('/v1/test/json').set({ accept: accept.invalidLength }).expect(tooLarge);
  });

  await it('handles accept header for produces multiple (2)', async () => {
    // attempt 2 also doesnt work - different produces, but still only 1
    await client.get('/v1/test/both').set({ accept: accept.json }).expect(json);
    await client.get('/v1/test/both').set({ accept: accept.any }).expect(html);
    await client.get('/v1/test/both').set({ accept: accept.empty }).expect(html);
    await client
      .silence('Not acceptable')
      .get('/v1/test/both')
      .set({ accept: accept.plaintext })
      .expect(
        notAcceptable(
          'Requested content-type "text/plain" not supported. Supported content types are "application/json", "text/html"',
        ),
      );
    await client.get('/v1/test/both').set({ accept: accept.html }).expect(html);
    await client.get('/v1/test/both').set({ accept: accept.jsonOrHtml }).expect(json);
    await client.get('/v1/test/both').set({ accept: accept.applicationOrHtml }).expect(json);
    await client.get('/v1/test/both').set({ accept: accept.htmlOrJson }).expect(html);
    await client.get('/v1/test/both').set({ accept: accept.htmlOrApplication }).expect(html);
    await client.get('/v1/test/both').set({ accept: accept.jsonOrText }).expect(json);
    await client.get('/v1/test/both').set({ accept: accept.textOrJson }).expect(html);
    await client.get('/v1/test/both').set({ accept: accept.invalidWeight }).expect(html);
    await client.silence('Not acceptable').get('/v1/test/json').set({ accept: accept.invalidLength }).expect(tooLarge);
  });
}).catch(console.error);
