import { TestDomainInterface } from '@/http/nodegen/domainInterfaces/TestDomainInterface';
import { HttpException } from '@/http/nodegen/errors';
import { default as NodegenRequest } from '@/http/nodegen/interfaces/NodegenRequest';
import { default as getPreferredResponseFormat } from 'src/http/nodegen/utils/getPreferredResponseFormat';

class TestDomain implements TestDomainInterface {
  async testBothGet(req: NodegenRequest): Promise<string | { test: string } | null> {
    const preferred = getPreferredResponseFormat(req.headers.accept || '*/*', ['application/json', 'text/html']);
    if (preferred === 'text/html') {
      return `<h1> Hi </h1>`;
    } else if (preferred === 'application/json') {
      return { test: 'true' };
    }

    if (req.headers.accept === 'application/yolo') {
      req.defaultContentType = 'text/html';

      return `<h1> Hi </h1>`;
    }

    // never really returned, infer response type will throw since cannot satisfy accept header
    return null;
  }

  async testHtmlGet(): Promise<string> {
    return '<h1> Hi </h1>';
  }

  async testJsonGet(): Promise<{ test: string }> {
    return { test: 'true' };
  }

  async testNoneGet(): Promise<void> {
    return;
  }
}

export default new TestDomain();
