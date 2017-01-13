import { requestApi } from '../../src/modules/requestApi';

describe('requestApi', () => {
  it('should send request to "https://search-staging.findify.io" in staging mode');

  it('should send request to "https://api-v3.findify.io" in production mode');

  it('should send request to "/feedback" endpoint');

  it('should convert data to query string');
});
