import * as expect from 'expect';

import { generateId } from '../../src/utils/generateId';

describe('generateId', () => {
  it('should generate 16 digit string', () => {
    expect(generateId().length).toBe(16);
  });
});
