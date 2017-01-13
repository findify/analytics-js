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
      const feedback = runInit();

      delete window.document.cookie;
      (window as any).localStorage = undefined;

      expect(feedback.getUser()).toBe(undefined);
    });

    it('should return user object from storage', () => {
      const feedback = runInit();

      const user = feedback.getUser();

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
    });

    it('should not send event if user was disabled cookies and localStorage', (done) => {
      const feedback = runInit();

      delete window.document.cookie;
      (window as any).localStorage = undefined;

      fauxJax.on('request', () => {
        done(new Error('Request was sent'));
        clearTimeout(timeout);
      });

      const timeout = setTimeout(done, 500);

      feedback.sendEvent('click-item', {
        rid: 'testRid',
        item_id: 'testItemId',
      });
    });

    it('should send "click-suggestion" event', (done) => {
      const feedback = runInit();
      const properties = {
        rid: 'testRid',
        suggestion: 'testSuggestion',
      };

      fauxJax.on('request', (req) => {
        expect(getQueryParams(req.requestURL)).toEqual({
          event: 'click-suggestion',
          user: getUser(),
          properties,
          key,
        });

        done();
      });

      feedback.sendEvent('click-suggestion', properties);
    });

    it('should send "click-item" event', (done) => {
      const feedback = runInit();
      const properties = {
        rid: 'testRid',
        item_id: 'testItemId',
      };

      fauxJax.on('request', (req) => {
        expect(getQueryParams(req.requestURL)).toEqual({
          event: 'click-item',
          user: getUser(),
          properties,
          key,
        });

        done();
      });

      feedback.sendEvent('click-item', properties);
    });

    it('should send "redirect" event', (done) => {
      const feedback = runInit();
      const properties = {
        rid: 'testRid',
        suggestion: 'testSuggestion',
      };

      fauxJax.on('request', (req) => {
        expect(getQueryParams(req.requestURL)).toEqual({
          event: 'redirect',
          user: getUser(),
          properties,
          key,
        });

        done();
      });

      feedback.sendEvent('redirect', properties);
    });

    it('should send "purchase" event', (done) => {
      const feedback = runInit();
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
        expect(getQueryParams(req.requestURL)).toEqual({
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

      feedback.sendEvent('purchase', properties);
    });

    it('should send "add-to-cart" event', (done) => {
      const feedback = runInit();
      const properties = {
        item_id: 'testItemId',
        rid: 'testRid',
        quantity: 1,
      };

      fauxJax.on('request', (req) => {
        expect(getQueryParams(req.requestURL)).toEqual({
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

      feedback.sendEvent('add-to-cart', properties);
    });

    it('should send "update-cart" event', (done) => {
      const feedback = runInit();
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
        expect(getQueryParams(req.requestURL)).toEqual({
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

      feedback.sendEvent('update-cart', properties);
    });

    it('should send "view-page" event', (done) => {
      const feedback = runInit();
      const itemId = 'testItemId';

      fauxJax.on('request', (req) => {
        const params = getQueryParams(req.requestURL);

        expect(params.key).toBe(key);
        expect(params.event).toBe('view-page');
        expect(params.user).toEqual(getUser());
        expect(params.properties).toEqual({
          url: 'http://jsdom-url.com/',
          ref: 'http://jsdom-referrer-url.com',
          width: '0',
          height: '0',
          item_id: itemId,
        });

        done();
      });

      feedback.sendEvent('view-page', {
        item_id: itemId,
      });
    });
  });
});
