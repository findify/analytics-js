import * as jsdom from 'jsdom';

declare const global: {
  window: any,
  document: any,
};

function setupJsDom(onInit?) {
  jsdom.env({
    html: '<!DOCTYPE html><html><head></head><body></body></html>',
    url: 'http://jsdom-url.com',
    document: {
      referrer: 'http://jsdom-referrer-url.com',
    },
    features: {
      FetchExternalResources: ['script', 'img'],
      ProcessExternalResources: ['script'],
    },
    done: (err, window) => {
      global.window = window;
      global.document = global.window.document;

      initCookies(global.window);
      initLocalStorage(global.window);

      if (onInit) {
        onInit();
      }
    },
  });
}

function initCookies(w) {
  let cookie = '';

  Object.defineProperty(w.document, 'cookie', {
    configurable: true,
    get() {
      return cookie;
    },
    set(value) {
      cookie += !cookie ? value : '; ' + value;
    },
  });
}

function initLocalStorage(w) {
  let storage = {};

  w.localStorage = {
    setItem(key, value) {
      storage[key] = value;
    },
    getItem(key) {
      return storage[key] || null;
    },
    removeItem(key) {
      delete storage[key];
    },
  };
}

function teardownJsDom() {
  delete global.window;
  delete global.document;
}

export {
  setupJsDom,
  teardownJsDom,
}
