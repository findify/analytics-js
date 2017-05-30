import * as store from 'store';
import * as expire from 'store/plugins/expire';

store.addPlugin(expire);

function read(name: string): any {
  return store.get(name);
}

function write(name: string, value?: string, permanent?: boolean) {
  const ttl = permanent ? (1000 * 3600 * 24 * 365 * 30) : (1000 * 60 * 30);
  if (!value) return store.remove(name);
  return store.set(name, value, new Date().getTime() + ttl)
}

export {
  read,
  write
};
