import * as Cookies from 'js-cookie';

function readCookie(name: string) {
  return Cookies.get(name);
}

function writeCookie(increment: number, name: string, value?: string) {
  typeof value === 'undefined' ? (
    Cookies.remove(name)
  ) : (
    Cookies.set(name, value, {
      expires:  new Date(new Date().getTime() + increment),
    })
  );
}

function readStorage(name: string) {
  try {
    if (
      'localStorage' in window &&
      window.localStorage.getItem &&
      new Date(Number(window.localStorage.getItem(name + '_ttl'))).getTime() > new Date().getTime()
    ) {
      return window.localStorage.getItem(name);
    }
  } catch (e) {}
}

function writeStorage(increment: number, name: string, value?: string) {
  try {
    if ('localStorage' in window) {
      if (value) {
        const ttl = String(new Date().getTime() + increment);

        window.localStorage.setItem(name, value);
        window.localStorage.setItem(name + '_ttl', ttl);
      } else {
        window.localStorage.removeItem(name);
        window.localStorage.removeItem(name + '_ttl');
      }
    }
  } catch (e) {}
}

function read(name: string) {
  const cookie = readCookie(name);
  const local = readStorage(name);

  return cookie || local;
}

function write(name: string, value?: string, permanent?: boolean) {
  const increment = permanent ? (1000 * 3600 * 24 * 365 * 30) : (1000 * 60 * 30);

  writeCookie(increment, name, value);
  writeStorage(increment, name, value);
}

export {
  read,
  write,
};
