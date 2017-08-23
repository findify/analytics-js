import reduce = require('lodash/reduce');
import assign = require('lodash/assign');
import isNull = require('lodash/isNull');

function cleanObject(obj: InputObject) {
  return reduce(obj, (acc: InputObject, value: any, key: string) => (
    typeof value === 'undefined' || isNull(value) || value === '' ? (
      acc
    ) : (
      assign({}, acc, {
        [key]: value,
      })
    )
  ), {});
}

type InputObject = {
  [key: string]: any,
};

export {
  cleanObject,
}
