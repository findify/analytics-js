import * as fauxJax from 'faux-jax';
import * as expect from 'expect';
import * as rewire from 'rewire';
import * as qs from 'qs';
import * as url from 'url';
import { setupJsDom, teardownJsDom } from '../jsdom-helper';

const r = rewire('../../src/modules/requestApi');

const requestApi = r.__get__('requestApi');

describe('requestApi', () => {
  const user = {
    uid: 'testUserId',
    sid: 'testSessionId',
  };

  const getQueryParams = (link: string) => qs.parse(url.parse(link).query);
  const makeGenericRequest = () => requestApi({
    user,
    event: 'click-item',
    properties: {
      item_id: 'itemId',
    },
  });

  beforeEach((done) => {
    fauxJax.install();
    setupJsDom(done);
  });

  afterEach(() => {
    fauxJax.restore();
    teardownJsDom();
  });

  it('should send proper request', (done) => {
    const restoreEnv = r.__set__('env', require('../../src/env/staging'));

    fauxJax.on('request', (req) => {
      expect(req.requestURL).toEqual(
        'https://search-staging.findify.io' +
        '/feedback?' +
        'user%5Buid%5D=testUserId&user%5Bsid%5D=testSessionId&event=click-item&properties%5Bitem_id%5D=itemId');
      done();
    });

    makeGenericRequest();
    restoreEnv();
  });

  it('should send GET request to server', (done) => {
    fauxJax.on('request', (req) => {
      expect(req.requestMethod).toEqual('GET');
      done();
    });

    makeGenericRequest();
  });

  it('should send request to "https://search-staging.findify.io" in staging mode', (done) => {
    const restoreEnv = r.__set__('env', require('../../src/env/staging'));

    fauxJax.on('request', (req) => {
      expect(req.requestURL).toMatch(/https:\/\/search-staging.findify.io/);
      done();
    });

    makeGenericRequest();
    restoreEnv();
  });

  it('should send request to "https://api-v3.findify.io" in production mode', (done) => {
    const restoreEnv = r.__set__('env', require('../../src/env/production'));

    fauxJax.on('request', (req) => {
      expect(req.requestURL).toMatch(/https:\/\/api-v3.findify.io/);
      done();
    });

    makeGenericRequest();
    restoreEnv();
  });

  it('should send request to "/feedback" endpoint', (done) => {
    fauxJax.on('request', (req) => {
      expect(url.parse(req.requestURL).pathname).toEqual('/feedback');
      done();
    });

    makeGenericRequest();
  });

  it('should convert data to query string', (done) => {
    const s = 'user%5Buid%5D=testUserId&user%5Bsid%5D=testSessionId&event=click-item&properties%5Bitem_id%5D=itemId';
    fauxJax.on('request', (req) => {
      expect(url.parse(req.requestURL).query).toEqual(s);
      done();
    });

    makeGenericRequest();
  });
});
