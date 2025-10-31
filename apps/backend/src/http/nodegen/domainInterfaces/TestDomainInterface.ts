import {} from '@/http/nodegen/interfaces';

import NodegenRequest from '@/http/interfaces/NodegenRequest';

export interface TestDomainInterface {
  /**
   * Operation ID: testAlsoBothGet
   * Summary: Produces both html and json
   * Description: Trying to get getSingleSuccessResponse template helper to put both produces in the routes file, didnt work
   * No additional middleware used
   **/
  testAlsoBothGet(req: any): Promise<any>;

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
}
