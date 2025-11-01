import {} from '@/http/nodegen/interfaces';

import NodegenRequest from '@/http/interfaces/NodegenRequest';

export interface TestDomainInterface {
  /**
   * Operation ID: testBothGet
   * Summary: Produces both html and json
   * Description: No description written
   * No additional middleware used
   **/
  testBothGet(req: any): Promise<any>;

  /**
   * Operation ID: testHtmlGet
   * Summary: Produces html
   * Description: No description written
   * No additional middleware used
   **/
  testHtmlGet(): Promise<any>;

  /**
   * Operation ID: testJsonGet
   * Summary: Produces json
   * Description: No description written
   * No additional middleware used
   **/
  testJsonGet(): Promise<any>;

  /**
   * Operation ID: testNoneGet
   * Summary: Produces nothing
   * Description: No description written
   * No additional middleware used
   **/
  testNoneGet(): Promise<any>;
}
