import { init } from '../src/index';

describe('init', () => {
  describe('generic', () => {
    it('set session id if it`s not exists or expired');

    it('set user id if it`s not exists or expired');
  });

  describe('getUser', () => {
    it('should return user object from storage');
  });

  describe('sendEvent', () => {
    it('should send "click-suggestion" event');

    it('should send "click-item" event');

    it('should send "redirect" event');

    it('should send "purchase" event');

    it('should send "add-to-cart" event');

    it('should send "update-cart" event');

    it('should send "view-page" event');
  });
});
