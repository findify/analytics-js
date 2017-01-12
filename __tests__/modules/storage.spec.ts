import * as expect from 'expect';
import * as rewire from 'rewire';

const s = rewire('../../src/modules/storage');

const read = s.__get__('read');
const write = s.__get__('write');
const readCookie = s.__get__('readCookie');
const writeCookie = s.__get__('writeCookie');
const readStorage = s.__get__('readStorage');
const writeStorage = s.__get__('writeStorage');

declare const global: {
  document: any,
  window: any,
};

describe('storage', () => {

  beforeEach(() => {
    let storage = {};

    global.window = {
      localStorage: {
        setItem(key, value) {
          storage[key] = value;
        },
        getItem(key) {
          return storage[key] || null;
        },
        removeItem(key) {
          delete storage[key];
        },
      },
    };

    global.document = {
      __cookie: '',
      get cookie() {
        return this.__cookie;
      },
      set cookie(value) {
        this.__cookie += !this.__cookie ? value : '; ' + value;
      },
    };
  });

  afterEach(() => {
    global.window = undefined;
    global.document = undefined;
  });

  describe('read', () => {
    it('should call "readCookie" and "readStorage" with proper "name"', () => {
      const readCookieSpy = expect.createSpy();
      const readStorageSpy = expect.createSpy();

      const revertReadCookie = s.__set__('readCookie', readCookieSpy);
      const revertReadStorage = s.__set__('readStorage', readStorageSpy);

      read('key');

      expect(readCookieSpy).toHaveBeenCalledWith('key');
      expect(readStorageSpy).toHaveBeenCalledWith('key');

      revertReadCookie();
      revertReadStorage();
    });

    it('should return cookie value by default', () => {
      const _readCookie = () => 'value1'
      const _readStorage = () => 'value2';

      const revertReadCookie = s.__set__('readCookie', _readCookie);
      const revertReadStorage = s.__set__('readStorage', _readStorage);

      expect(read('key')).toEqual('value1');

      revertReadCookie();
      revertReadStorage();
    });

    it('should return localStorage value if cookie does not exists', () => {
      const _readCookie = () => undefined;
      const _readStorage = () => 'value2';

      const revertReadCookie = s.__set__('readCookie', _readCookie);
      const revertReadStorage = s.__set__('readStorage', _readStorage);

      expect(read('key')).toEqual('value2');

      revertReadCookie();
      revertReadStorage();
    });
  });

  describe('write', () => {
    it('should provide "increment" variable to "writeCookie" and "setCookie" equal to 30min if "permanent=false"', () => {
      const writeCookieSpy = expect.createSpy();
      const writeStorageSpy = expect.createSpy();

      const revertWriteCookie = s.__set__('writeCookie', writeCookieSpy);
      const revertWriteStorage = s.__set__('writeStorage', writeStorageSpy);

      write('key', 'someValue');

      const thirtyMins = 30 * 60 * 1000;

      expect(writeCookieSpy.calls[0].arguments[0]).toEqual(thirtyMins);
      expect(writeStorageSpy.calls[0].arguments[0]).toEqual(thirtyMins);

      revertWriteCookie();
      revertWriteStorage();
    });

    it('should provide "increment" variable to "writeCookie" and "setCookie" equal to 30years if "permanent=true"', () => {
      const writeCookieSpy = expect.createSpy();
      const writeStorageSpy = expect.createSpy();

      const revertWriteCookie = s.__set__('writeCookie', writeCookieSpy);
      const revertWriteStorage = s.__set__('writeStorage', writeStorageSpy);

      write('key', 'someValue', true);

      const thrtyYears = 30 * 365 * 24 * 60 * 60 * 1000;

      expect(writeCookieSpy.calls[0].arguments[0]).toEqual(thrtyYears);
      expect(writeStorageSpy.calls[0].arguments[0]).toEqual(thrtyYears);

      revertWriteCookie();
      revertWriteStorage();
    });

    it('should call "writeCookie" and "writeStorage" with with proper "name"', () => {
      const writeCookieSpy = expect.createSpy();
      const writeStorageSpy = expect.createSpy();

      const revertWriteCookie = s.__set__('writeCookie', writeCookieSpy);
      const revertWriteStorage = s.__set__('writeStorage', writeStorageSpy);

      write('key');

      expect(writeCookieSpy.calls[0].arguments[1]).toEqual('key');
      expect(writeStorageSpy.calls[0].arguments[1]).toEqual('key');

      revertWriteCookie();
      revertWriteStorage();
    });

    it('should call "writeCookie" and "writeStorage" with with proper "value"', () => {
      const writeCookieSpy = expect.createSpy();
      const writeStorageSpy = expect.createSpy();

      const revertWriteCookie = s.__set__('writeCookie', writeCookieSpy);
      const revertWriteStorage = s.__set__('writeStorage', writeStorageSpy);

      write('key', 'someValue');

      expect(writeCookieSpy.calls[0].arguments[2]).toEqual('someValue');
      expect(writeStorageSpy.calls[0].arguments[2]).toEqual('someValue');

      revertWriteCookie();
      revertWriteStorage();
    });
  });

  describe('readCookie', () => {
    const assertionsData = [{
      key: 'test',
      value: 'someValue',
    }, {
      key: 'test',
      value: "hello=world",
    }];

    assertionsData.forEach((item) => {
      it(`should return "${item.value}" if "${item.key}" was provided`, () => {
        document.cookie = `${item.key}=${item.value}`;

        expect(readCookie(item.key)).toEqual(item.value);
      });
    });

    it('should return "undefined" if entry doesn`t exists in cookies', () => {
      document.cookie = 'key=value';

      expect(readCookie('test')).toEqual(undefined);
    });

    it('should return "undefined" if cookies are empty', () => {
      document.cookie = '';

      expect(readCookie('test')).toEqual(undefined);
    });
  });

  describe('writeCookie', () => {
    it('should write entry to cookies', () => {
      writeCookie(1000, 'test', 'someValue');

      const data = document.cookie.split('; ');

      expect(data[0]).toEqual('test=someValue');
      expect(data[1]).toMatch(/expires=.*/);
      expect(data[2]).toEqual('path=/');
    });

    it('should remove existing entry if "value" is not provided', () => {
      document.cookie = 'key=value';

      writeCookie(1000, 'key');

      expect(document.cookie).toMatch(/key=; expires=.*; path=\//);
    });
  });

  describe('readStorage', () => {
    it('should return value if entry exists in localStorage', () => {
      window.localStorage.setItem('key', 'someValue');
      window.localStorage.setItem('key_ttl', ((new Date()).getTime() + 1000).toString());

      expect(readStorage('key')).toEqual('someValue');
    });

    it('should return "undefined" if entry doesn`t exists in localStorage', () => {
      expect(readStorage('key')).toEqual(undefined);
    });

    it('should return "undefined" if localStorage is disabled', () => {
      (window as any).localStorage = undefined;
      expect(readStorage('key')).toEqual(undefined);
    });

    it('should return "undefined" if entry expired', () => {
      window.localStorage.setItem('key', 'someValue');
      window.localStorage.setItem('key_ttl', ((new Date()).getTime() - 1000).toString());

      expect(readStorage('key')).toEqual(undefined);
    });
  });

  describe('writeStorage', () => {
    it('should write entry to localStorage', () => {
      writeStorage(1000, 'key', 'someValue');
      expect(window.localStorage.getItem('key')).toEqual('someValue');
    });

    it('should write "name_" + _ttl entry to localStorage with lifetime timestamp', () => {
      writeStorage(1000, 'key', 'someValue');
      expect(parseInt(window.localStorage.getItem('key_ttl'))).toBeA('number');
    });

    it('should remove existing entry if "value" is not provided', () => {
      window.localStorage.setItem('key', 'someValue');
      window.localStorage.setItem('key_ttl', ((new Date()).getTime() + 1000).toString());

      writeStorage(1000, 'key');

      expect(window.localStorage.getItem('key')).toNotExist();
      expect(window.localStorage.getItem('key_ttl')).toNotExist();
    });

    it('should return "undefined" and do nothing if localStorage is disabled', () => {
      (window as any).localStorage = undefined;
      expect(writeStorage(1000, 'key', 'someValue')).toEqual(undefined);
    });
  });
});
