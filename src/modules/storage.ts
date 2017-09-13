import * as store from 'store';
import * as expire from 'store/plugins/expire';
import env = require('../env');

store.addPlugin(expire);

const symbols = '0123456789acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMOPQRSTUVWXYZ';

function generateId() {
  let str = '';
  for (let i = 0; i < 16; i++) {
    str += symbols[(Math.random() * symbols.length | 0)];
  }
  return str;
}

const { uidKey, sidKey, cartKey, ctKey }  = env.storage;

function read(name: string): any {
  return store.get(name);
}

function write(name: string, value?: any, permanent?: boolean) {
  const ttl = permanent ? (1000 * 3600 * 24 * 365 * 30) : (1000 * 60 * 30);
  if (!value) return store.remove(name);
  return store.set(name, value, new Date().getTime() + ttl)
}

function createUid () {
  const id = generateId();
  write(uidKey, id, true);
  return id;
};

function createSid () {
  const id = generateId();
  write(sidKey, generateId());
  return id;
};

const persist = !!(read(uidKey) && read(sidKey));

export default {
  get uid () { return read(uidKey) || createUid() },
  get sid () { return read(sidKey) || createSid() },
  get cart() { return read(cartKey) },
  set cart(data) { write(cartKey, data) },
  get exist() { return !!(read(uidKey) && read(sidKey) )},

  persist,

  memoize(type, request) {
    write(ctKey, { type, request })
  },

  get memorized() {
    const data = read(ctKey.storage.ctKey);
    if (!data) { return {} };
    write(ctKey);
    return data;
  },
};
