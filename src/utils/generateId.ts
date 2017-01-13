function generateId() {
  const symbols = '0123456789acbdefghijklmnopqrstuvwxyzABCDEFGHIJKLMOPQRSTUVWXYZ';
  let str = '';

  for (let i = 0; i < 16; i++) {
    str += symbols[(Math.random() * symbols.length | 0)];
  }

  return str;
}

export {
  generateId,
};
