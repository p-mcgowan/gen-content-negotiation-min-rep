import { TestDomainInterface } from '@/http/nodegen/domainInterfaces/TestDomainInterface';
import { HttpException } from '@/http/nodegen/errors';
import { Request } from 'express';
import { default as getPreferredResponseFormat } from 'src/http/nodegen/utils/getPreferredResponseFormat';

class TestDomain implements TestDomainInterface {
  async testAlsoBothGet(req: Request): Promise<string | { test: string }> {
    const preferred = getPreferredResponseFormat(req.headers.accept || '*/*', ['text/html', 'application/json']);

    if (preferred === 'text/html') {
      return `<h1> Hi </h1>`;
    } else if (preferred === 'application/json') {
      return { test: 'true' };
    }

    throw new HttpException(406, `Not acceptable from domain - no valid preference: '${preferred}'`);
  }

  async testBothGet(req: Request): Promise<string | { test: string }> {
    const preferred = getPreferredResponseFormat(req.headers.accept || '*/*', ['text/html', 'application/json']);

    if (preferred === 'text/html') {
      return `<h1> Hi </h1>`;
    } else if (preferred === 'application/json') {
      return { test: 'true' };
    }

    throw new HttpException(406, `Not acceptable from domain - no valid preference: '${preferred}'`);
  }

  async testHtmlGet(): Promise<string> {
    return '<h1> Hi </h1>';
  }

  async testJsonGet(): Promise<{ test: string }> {
    return { test: 'true' };
  }
}

export default new TestDomain();
