import * as times from 'lodash/times';

function uuid(n: number) {
  const list = '0123456789acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMOPQRSTUVWXYZ';
  return times(n).reduce((acc, i) => (
    acc + list[(Math.random() * list.length | 0)]
  ), '');
}

export {
  uuid,
}
