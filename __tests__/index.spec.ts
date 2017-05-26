import * as expect from 'expect';
import * as fauxJax from 'faux-jax';
import * as qs from 'qs';
import * as url from 'url';
import { setupJsDom, teardownJsDom } from './jsdom-helper';
import { init } from '../src/index';

describe('init', () => {
  const runInit = () => init({ key: 'testKey' });

  beforeEach((done) => {
    fauxJax.install();
    setupJsDom(done);
  });
  afterEach(() => {
    fauxJax.restore();
    teardownJsDom();
  });

  describe('generic', () => {
    it('should set session id if it`s not exists or expired', () => {
      runInit();

      expect(window.document.cookie).toMatch(/_findify_visit.*;/);
      expect(window.localStorage.getItem('_findify_visit')).toExist();
    });

    it('should set user id if it`s not exists or expired', () => {
      runInit();

      expect(window.document.cookie).toMatch(/_findify_uniq.*;/);
      expect(window.localStorage.getItem('_findify_uniq')).toExist();
    });
  });

  describe('getUser', () => {
    it('should return "undefined" ether user id or session id is "undefined"', () => {
      const analytics = runInit();

      delete window.document.cookie;
      (window as any).localStorage = undefined;
      const user = analytics.getUser();
      expect(user.exist).toBe(false);
      expect(user.persist).toBe(false);
      expect(user.sid).toBe(void 0);
      expect(user.uid).toBe(void 0);
    });

    it('should return user object from storage', () => {
      const analytics = runInit();

      const user = analytics.getUser();

      expect(user.uid).toExist();
      expect(user.sid).toExist();
    });
  });

  describe('sendEvent', () => {
    const getQueryParams = (link: string) => qs.parse(url.parse(link).query);
    const key = 'testKey';
    const getUser = () => ({
      uid: window.localStorage.getItem('_findify_uniq'),
      sid: window.localStorage.getItem('_findify_visit'),
      exist: 'true',
      persist: 'false',
    });

    it('should not send event if user was disabled cookies and localStorage', (done) => {
      const analytics = runInit();

      delete window.document.cookie;
      (window as any).localStorage = undefined;

      fauxJax.on('request', () => {
        done(new Error('Request was sent'));
        clearTimeout(timeout);
      });

      const timeout = setTimeout(done, 500);

      analytics.sendEvent('click-item', {
        rid: 'testRid',
        item_id: 'testItemId',
      });
    });

    it('should send "click-suggestion" event', (done) => {
      const analytics = runInit();
      const properties = {
        rid: 'testRid',
        suggestion: 'testSuggestion',
      };

      fauxJax.on('request', (req) => {
        const params = getQueryParams(req.requestURL);

        expect(params.t_client).toExist();
        expect(params).toContain({
          event: 'click-suggestion',
          user: getUser(),
          properties,
          key,
        });

        done();
      });

      analytics.sendEvent('click-suggestion', properties);
    });

    it('should send "click-item" event', (done) => {
      const analytics = runInit();
      const properties = {
        rid: 'testRid',
        item_id: 'testItemId',
      };

      fauxJax.on('request', (req) => {
        const params = getQueryParams(req.requestURL);

        expect(params.t_client).toExist();
        expect(params).toContain({
          event: 'click-item',
          user: getUser(),
          properties,
          key,
        });

        done();
      });

      analytics.sendEvent('click-item', properties);
    });

    it('should send "redirect" event', (done) => {
      const analytics = runInit();
      const properties = {
        rid: 'testRid',
        suggestion: 'testSuggestion',
      };

      fauxJax.on('request', (req) => {
        const params = getQueryParams(req.requestURL);

        expect(params.t_client).toExist();
        expect(params).toContain({
          event: 'redirect',
          user: getUser(),
          properties,
          key,
        });

        done();
      });

      analytics.sendEvent('redirect', properties);
    });

    it('should send "purchase" event', (done) => {
      const analytics = runInit();
      const properties = {
        order_id: 'testOrderId',
        currency: 'testCurrency',
        revenue: 100,
        affiliation: 'testAffiliation',
        line_items: [{
          item_id: 'testItemId',
          unit_price: 100,
          quantity: 1,
        }, {
          item_id: 'testItemId2',
          unit_price: 100,
          quantity: 1,
        }],
      };

      fauxJax.on('request', (req) => {
        const params = getQueryParams(req.requestURL);

        expect(params.t_client).toExist();
        expect(params).toContain({
          event: 'purchase',
          user: getUser(),
          properties: {
            order_id: 'testOrderId',
            currency: 'testCurrency',
            revenue: '100',
            affiliation: 'testAffiliation',
            line_items: [{
              item_id: 'testItemId',
              unit_price: '100',
              quantity: '1',
            }, {
              item_id: 'testItemId2',
              unit_price: '100',
              quantity: '1',
            }],
          },
          key,
        });

        done();
      });

      analytics.sendEvent('purchase', properties);
    });

    it('should send "add-to-cart" event', (done) => {
      const analytics = runInit();
      const properties = {
        item_id: 'testItemId',
        rid: 'testRid',
        quantity: 1,
      };

      fauxJax.on('request', (req) => {
        const params = getQueryParams(req.requestURL);

        expect(params.t_client).toExist();
        expect(params).toContain({
          event: 'add-to-cart',
          user: getUser(),
          properties: {
            item_id: 'testItemId',
            rid: 'testRid',
            quantity: '1',
          },
          key,
        });

        done();
      });

      analytics.sendEvent('add-to-cart', properties);
    });

    it('should send "update-cart" event', (done) => {
      const analytics = runInit();
      const properties = {
        line_items: [{
          item_id: 'testItemId',
          unit_price: 100,
          quantity: 1,
        }, {
          item_id: 'testItemId2',
          unit_price: 100,
          quantity: 1,
        }],
      };

      fauxJax.on('request', (req) => {
        const params = getQueryParams(req.requestURL);

        expect(params.t_client).toExist();
        expect(params).toContain({
          event: 'update-cart',
          user: getUser(),
          properties: {
            line_items: [{
              item_id: 'testItemId',
              unit_price: '100',
              quantity: '1',
            }, {
              item_id: 'testItemId2',
              unit_price: '100',
              quantity: '1',
            }],
          },
          key,
        });

        done();
      });

      analytics.sendEvent('update-cart', properties);
    });

    it('should send "view-page" event', (done) => {
      const analytics = runInit();
      const itemId = 'testItemId';

      fauxJax.on('request', (req) => {
        const params = getQueryParams(req.requestURL);

        expect(params.key).toBe(key);
        expect(params.event).toBe('view-page');
        expect(params.user).toEqual(getUser());
        expect(params.t_client).toExist();
        expect(params.properties).toContain({
          url: 'http://jsdom-url.com/',
          ref: 'http://jsdom-referrer-url.com',
          width: '0',
          height: '0',
          item_id: itemId,
        });

        done();
      });

      analytics.sendEvent('view-page', {
        item_id: itemId,
      });
    });

    it('should not throw an Error if "item_id" is not provided', () => {
      const analytics = runInit();

      expect(() => analytics.sendEvent('view-page')).toNotThrow();
      expect(() => analytics.sendEvent('view-page', {})).toNotThrow();
    });
  });
});
